const express = require('express');
const dotenv = require('dotenv');
const fetch = require("node-fetch");
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
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

    db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1 AND time_stamp > $2;",
            [ req.user.id, oneDayAgo, ])
    .then((reports) =>
    {
        return res.status(200).send({ status: "Successfully got reports.", reports: reports, });
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to get reports. Try again later." });
    });

});


router.get('/api/insights', auth, (req, res, next) =>
{
    db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1;",
        [ req.user.id, ])
    .then((reports) =>
    {
        const minIndex = Math.max(0, reports.length - parseInt(process.env.LLM_SERVER_MAX_REPORTS));
        const maxIndex = reports.length;

        const body =
        {
            text: reports
                    .slice(minIndex, maxIndex)
                    .map((report) =>
                        {
                            const date = new Date(parseInt(report.time_stamp));

                            return {
                                domain: report.domain,
                                timestamp: (date.toDateString() + " " + date.toLocaleTimeString()),
                            };
                        }),
        };

        console.log(body);

        fetch(process.env.LLM_SERVER_ENDPOINT,
            {
                method: "POST",
                body: JSON.stringify(body),
                headers:
                {
                    "Content-Type": "application/json",
                },
            }
        )
        .then(async (response) =>
        {
            const insights = await response.text();
            return res.status(200).send({ status: "Successfully generated insights.", insights: insights, });
        })
        .catch((error) =>
        {
            console.log(error);
            return res.status(500).send({ status: "Failed to get insights. Try again later." });
        });
    })
    .catch((error) =>
    {
        console.log(error);
        return res.status(500).send({ status: "Failed to get insights. Try again later." });
    });
});

export { router };