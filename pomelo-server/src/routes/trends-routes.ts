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
                websites: domains.reduce((accum, val) => { return accum.append(val.domain) } , [])
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
        return res.status(400).send({ status: "Failed to put user data. Include all fields before submitting.", });
    }

    db.any("DELETE FROM time_wasters WHERE user_id = $1 AND domain = $2;",
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



export { router };