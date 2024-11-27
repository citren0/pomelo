const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

import { db } from '../database';
import Roles from '../models/Roles';
import mustHaveRole from '../services/mustHaveRole';
import auth from '../services/token';
import { TimeWasted } from '../models/TimeWasted';

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
    if (!req.query.hasOwnProperty("start_month") ||
        !req.query.hasOwnProperty("start_day") ||
        !req.query.hasOwnProperty("start_year") ||
        !req.query.hasOwnProperty("stop_month") ||
        !req.query.hasOwnProperty("stop_day") ||
        !req.query.hasOwnProperty("stop_year"))
    {
        return res.status(400).send({ status: "Failed to get time wasted. Include all fields before submitting.", });
    }

    if (isNaN(parseInt(req.query.start_month)) ||
        isNaN(parseInt(req.query.start_year)) ||
        isNaN(parseInt(req.query.start_month)) ||
        isNaN(parseInt(req.query.stop_month)) ||
        isNaN(parseInt(req.query.stop_year)) ||
        isNaN(parseInt(req.query.stop_month)))
    {
        return res.status(400).send({ status: "Failed to get time wasted. Include all fields before submitting.", });
    }

    // Get user's time wasting websites.
    db.any("SELECT domain FROM time_wasters WHERE user_id = $1;",
            [req.user.id])
    .then((domains) =>
    {
        // Get user's reports
        const startDay = new Date(Date.UTC(req.query.start_year, req.query.start_month, req.query.start_day, 0, 0, 0));
        const stopDay = new Date(Date.UTC(req.query.stop_year, req.query.stop_month, req.query.stop_day, 23, 59, 59, 999));

        // Create buckets by day.
        const buckets: number[][] = [];
        var time = startDay.getTime();
        while (time < stopDay.getTime())
        {
            const oldTime = time;
            time = time + (24 * 60 * 60 * 1000);
            buckets.push([oldTime, time]);
        }

        // Select all reports within that time frame.
        db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1 AND time_stamp >= $2 AND time_stamp <= $3;",
                [req.user.id, startDay.getTime(), stopDay.getTime()])
        .then((reports) =>
        {
            const websites = domains.reduce((accum, val) => { accum.push(val.domain); return accum; } , []);

            const sorted_reports = reports.sort((a, b) => a.time_stamp - b.time_stamp);

            // Bucket time by day.
            const days: TimeWasted[] = [];
            buckets.forEach((bucket: number[]) =>
            {
                const total_time_spent = sorted_reports.reduce(
                    (accum, val, idx, arr) =>
                    {
                        if (idx == (arr.length - 1))
                        {
                            // Last index, dont count. Accuracy will be sacrificed.
                            return accum;
                        }
                        else
                        {
                            if (val.time_stamp >= bucket[0] && val.time_stamp < bucket[1])
                            {
                                // Calculate time between this report and the next.
                                const time_spent = Math.abs(arr[idx + 1].time_stamp - val.time_stamp);
                                return accum + time_spent;
                            }
                            else
                            {
                                return accum;
                            }
                        }
                    }, 0);
                
                const time_wasted = sorted_reports.reduce(
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
                                if (val.time_stamp >= bucket[0] && val.time_stamp < bucket[1])
                                {
                                    // Calculate time between this report and the next.
                                    const time_spent = Math.abs(arr[idx + 1].time_stamp - val.time_stamp);
                                    return accum + time_spent;
                                }
                                else
                                {
                                    return accum;
                                }
                            }
                        }
                        else
                        {
                            return accum;
                        }
                    }, 0);

                days.push({
                    time_stamp: bucket[0],
                    total_time_spent: Number((total_time_spent / (1000 * 60)).toPrecision(3)),
                    time_wasted: Number((time_wasted / (1000 * 60)).toPrecision(3)),
                });

            });

            return res.status(200).send({ status: "Fetched time wasted.", days: days, });
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