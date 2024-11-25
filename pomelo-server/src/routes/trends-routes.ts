const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

import { db } from '../database';
import Roles from '../models/Roles';
import mustHaveRole from '../services/mustHaveRole';
import auth from '../services/token';

// Environment setup.
dotenv.config();

  
router.get('/api/time_wasting_websites', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    db.any("SELECT domain FROM time_wasters WHERE user_id = $1;",
            [req.user.id])
    .then((domains) =>
    {
        return res.status(200).send(
            {
                status: "Successfully fetched user data.",
                websites: domains.reduce((accum, val) => { accum.push(val.domain); return accum; } , [])
            }
        );
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to get user data. Try again later.", });
    });

});


router.put('/api/time_wasting_websites', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    if (!req.query.hasOwnProperty("domain"))
    {
        return res.status(400).send({ status: "Failed to put user data. Include all fields before submitting.", });
    }

    if (req.query.domain.length == 0)
    {
        return res.status(400).send({ status: "Failed to put user data. Include all fields before submitting.", });
    }

    db.any("INSERT INTO time_wasters (user_id, domain) VALUES ($1, $2);",
            [req.user.id, decodeURIComponent(req.query.domain)])
    .then((domains) =>
    {
        return res.status(200).send({ status: "Successfully inserted website.", });
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to put user data. Try again later.", });
    });

});


router.delete('/api/time_wasting_websites', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    if (!req.query.hasOwnProperty("domain"))
    {
        return res.status(400).send({ status: "Failed to delete user data. Include all fields before submitting.", });
    }

    db.any("DELETE FROM time_wasters WHERE user_id = $1 AND domain = $2;",
            [req.user.id, decodeURIComponent(req.query.domain)])
    .then((domains) =>
    {
        return res.status(200).send({ status: "Successfully deleted website.", });
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to delete user data. Try again later.", });
    });

});


router.get('/api/time_wasted', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    if (!req.query.hasOwnProperty("month") ||
        !req.query.hasOwnProperty("day") ||
        !req.query.hasOwnProperty("year"))
    {
        return res.status(400).send({ status: "Failed to get time wasted. Include all fields before submitting.", });
    }

    if (isNaN(parseInt(req.query.day)) ||
        isNaN(parseInt(req.query.year)) ||
        isNaN(parseInt(req.query.month)))
    {
        return res.status(400).send({ status: "Failed to get time wasted. Include all fields before submitting.", });
    }

    // Get user's time wasting websites.
    db.any("SELECT domain FROM time_wasters WHERE user_id = $1;",
            [req.user.id])
    .then((domains) =>
    {
        // Get user's reports
        const startDay = new Date(Date.UTC(req.query.year, req.query.month, req.query.day, 0, 0, 0));
        const stopDay = new Date(Date.UTC(req.query.year, req.query.month, req.query.day, 23, 59, 59, 999));

        db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1 AND time_stamp >= $2 AND time_stamp <= $3;",
                [req.user.id, startDay.getTime(), stopDay.getTime()])
        .then((reports) =>
        {
            const websites = domains.reduce((accum, val) => { accum.push(val.domain); return accum; } , []);

            const total_time_spent = reports.reduce(
                (accum, val, idx, arr) =>
                {
                    if (idx == (arr.length - 1))
                    {
                        // Last index, dont count. Accuracy will be sacrificed.
                        return accum;
                    }
                    else
                    {
                        // Calculate time between this report and the next.
                        const time_spent = Math.abs(arr[idx + 1].time_stamp - val.time_stamp);
                        return accum + time_spent;
                    }
                }, 0);
            
            const time_wasted = reports.reduce(
                (accum, val, idx, arr) =>
                {
                    if (websites.includes(val.domain))
                    {
                        if (idx == (arr.length - 1))
                        {
                            // Last index, dont count. Accuracy will be sacrificed.
                            return accum;
                        }
                        else
                        {
                            // Calculate time between this report and the next.
                            const time_spent = Math.abs(arr[idx + 1].time_stamp - val.time_stamp);
                            return accum + time_spent;
                        }
                    }
                    else
                    {
                        return accum;
                    }
                }, 0);

            return res.status(200).send({ status: "Fetched time wasted.", time_wasted: time_wasted, total_time_spent: total_time_spent, });
        })
        .catch((error) =>
        {
            return res.status(500).send({ status: "Failed to get time wasted. Try again later.", });
        });

    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to get time wasted. Try again later.", });
    });

});



export { router };