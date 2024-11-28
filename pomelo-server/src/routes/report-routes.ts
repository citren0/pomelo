const express = require('express');
const dotenv = require('dotenv');
const fetch = require("node-fetch");
const router = express.Router();
const OpenAI = require("openai");

import { db } from '../database';
import { hoursDictionary } from '../models/HoursDictionary';
import Roles from '../models/Roles';
import mustHaveRole from '../services/mustHaveRole';
import auth from '../services/token';

// Environment setup.
dotenv.config();

  
router.post('/api/report', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    if (!req.body.hasOwnProperty("domain") || !req.body.hasOwnProperty("favicon"))
    {
        return res.status(400).send({ status: "Include all fields before submitting.", });
    }

    if (typeof req.body.domain != "string" || typeof req.body.favicon != "string")
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


router.get('/api/report', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

    db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1 AND time_stamp > $2;",
            [ req.user.id, oneDayAgo, ])
    .then((reports) =>
    {
        reports.sort((a, b) => a.time_stamp < b.time_stamp);

        return res.status(200).send({ status: "Successfully got reports.", reports: reports, });
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to get reports. Try again later." });
    });

});


router.post('/api/insights', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    if (!req.body.hasOwnProperty("messages"))
    {
        return res.status(400).send({ status: "Failed to get insights. Include all fields before submitting." });
    }
    
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

    db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1  AND time_stamp > $2;",
        [ req.user.id, oneDayAgo, ])
    .then((reports) =>
    {
        if (reports.length < parseInt(process.env.LLM_MIN_REVIEWS))
        {
            return res.status(200).send({ status: "Successfully generated insights.", insights: "Too few datapoints. Try again when you've used Pomelo for longer.", });
        }

        db.any("SELECT domain, starttime AS start, stoptime AS stop FROM rules WHERE user_id = $1;",
                [req.user.id])
        .then((rules) =>
        {
            // Assemble JSON containing rules and reports.
            const body = {
                reports: reports
                        .sort((a, b) => a.time_stamp - b.time_stamp)
                        .map((report) =>
                            {
                                const date = new Date(parseInt(report.time_stamp));

                                return {
                                    domain: report.domain,
                                    timestamp: (date.toDateString() + " " + date.toLocaleTimeString()),
                                };
                            }
                        ),
                rules: rules.map((rule) =>
                        {
                            return {
                                domain: rule.domain,
                                start: hoursDictionary[rule.start],
                                stop: hoursDictionary[rule.stop],
                            };
                        }),
            };

            const client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });

            // Assemble messages.
            var messages = [
                {
                    role: "system",
                    content: process.env.OPENAI_SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: JSON.stringify(body),
                },
            ];
            messages = messages.concat(req.body.messages.map((message) =>
            {
                return {
                    role: message.me ? "user" : "assistant",
                    content: message.message,
                };
            }));
            
            const params = {
                messages: messages,
                model: process.env.OPENAI_MODEL,
            };

            client.chat.completions.create(params)
            .then((chatCompletion) =>
            {
                if (chatCompletion.choices.length > 0 &&
                    !chatCompletion.choices[0].message.refusal)
                {
                    return res.status(200).send({ status: "Successfully generated insights.", insights: chatCompletion.choices[0].message.content, });
                }
                else
                {
                    return res.status(500).send({ status: "Failed to get insights. Try again later." });
                }

            })
            .catch((error) =>
            {
                return res.status(500).send({ status: "Failed to get insights. Try again later." });
            });

        })
        .catch((error) =>
        {
            return res.status(500).send({ status: "Failed to get insights. Try again later." });
        });

    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to get insights. Try again later." });
    });
    
});

export { router };