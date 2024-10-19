const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

import { db } from '../database';
import auth from '../services/token';

// Environment setup.
dotenv.config();


router.post('/api/report', auth, (req, res, next) =>
{
    if (!req.body.hasOwnProperty("domain") || !req.body.hasOwnProperty("favicon"))
    {
        return res.status(400).send({ status: "Include all fields before submitting.", });
    }

    // User verified, add report to db.
    db.any("INSERT INTO web_activity (userid, time_stamp, domain, faviconUrl) values ($1, $2, $3, $4);",
            [req.user.id, Date.now(), req.body.domain, req.body.favicon, ])
    .then((_) =>
    {
        return res.status(200).send({ status: "Successfully added report." });
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to put report. Try again later." });
    });
        
});


router.get('/api/report', auth, (req, res, next) =>
{
    // User verified, add report to db.
    db.any("SELECT userid, time_stamp, domain, faviconUrl from web_activity WHERE userid = $1;",
            [ req.user.id, ])
    .then((reports) =>
    {
        return res.status(200).send({ status: "Successfully got reports.", reports: reports, });
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to put report. Try again later." });
    });

});

export { router };