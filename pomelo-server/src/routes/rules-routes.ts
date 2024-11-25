const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

import { db } from '../database';
import Roles from '../models/Roles';
import mustHaveRole from '../services/mustHaveRole';
import auth from '../services/token';

// Environment setup.
dotenv.config();

  
router.get('/api/rules', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    db.any("SELECT domain, starttime AS start, stoptime AS stop FROM rules WHERE user_id = $1;",
            [req.user.id ])
    .then((rules) =>
    {
        return res.status(200).send({ status: "Successfully fetched rules.", rules: rules, });
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to fetch rules. Try again later." });
    });
        
});


router.put('/api/rules', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    if (!req.query.hasOwnProperty("domain") || !req.query.hasOwnProperty("start") || !req.query.hasOwnProperty("stop"))
    {
        return res.status(400).send({ status: "Failed to remove rule. Include all fields before submitting." });
    }

    const decodeDomain = decodeURIComponent(req.query.domain);
    const decodeStart = decodeURIComponent(req.query.start);
    const decodeStop = decodeURIComponent(req.query.stop);

    if (typeof decodeDomain != "string" ||
        isNaN(parseInt(decodeStart)) ||
        isNaN(parseInt(decodeStop)))
    {
        return res.status(400).send({ status: "Failed to remove rule. Include all fields before submitting." });
    }

    db.any("INSERT INTO rules (user_id, domain, starttime, stoptime) values ($1, $2, $3, $4);",
            [req.user.id, decodeDomain, parseInt(decodeStart), parseInt(decodeStop)])
    .then((_) =>
    {
        return res.status(200).send({ status: "Successfully added rule." });
    })
    .catch((_) =>
    {
        return res.status(500).send({ status: "Failed to create rule. Rule may be a duplicate. Try again later." });
    });

});

router.delete('/api/rules', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    if (!req.query.hasOwnProperty("domain") || !req.query.hasOwnProperty("start") || !req.query.hasOwnProperty("stop"))
    {
        return res.status(400).send({ status: "Failed to remove rule. Include all fields before submitting." });
    }

    const decodeDomain = decodeURIComponent(req.query.domain);
    const decodeStart = decodeURIComponent(req.query.start);
    const decodeStop = decodeURIComponent(req.query.stop);

    if (typeof decodeDomain != "string" ||
        isNaN(parseInt(decodeStart)) ||
        isNaN(parseInt(decodeStop)))
    {
        return res.status(400).send({ status: "Failed to remove rule. Include all fields before submitting." });
    }

    db.any("DELETE FROM rules WHERE user_id = $1 AND domain = $2 AND starttime = $3 AND stoptime = $4;",
            [req.user.id, decodeDomain, parseInt(decodeStart), parseInt(decodeStop)])
    .then((_) =>
    {
        return res.status(200).send({ status: "Successfully removed rule." });
    })
    .catch((_) =>
    {
        return res.status(500).send({ status: "Failed to remove rule. Try again later." });
    });

});


export { router };