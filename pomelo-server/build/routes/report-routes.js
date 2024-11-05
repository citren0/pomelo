"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express = require('express');
var dotenv = require('dotenv');
var fetch = require("node-fetch");
var router = express.Router();
exports.router = router;
var OpenAI = require("openai");
var database_1 = require("../database");
var Roles_1 = require("../models/Roles");
var mustHaveRole_1 = require("../services/mustHaveRole");
var token_1 = require("../services/token");
// Environment setup.
dotenv.config();
router.post('/api/report', token_1.default, (0, mustHaveRole_1.default)(Roles_1.default.Verified), (0, mustHaveRole_1.default)(Roles_1.default.Paid), function (req, res, next) {
    if (!req.body.hasOwnProperty("domain") || !req.body.hasOwnProperty("favicon")) {
        return res.status(400).send({ status: "Include all fields before submitting.", });
    }
    if (typeof req.body.domain != "string" || typeof req.body.favicon != "string") {
        return res.status(400).send({ status: "Include all fields before submitting.", });
    }
    database_1.db.any("INSERT INTO web_activity (userid, time_stamp, domain, faviconUrl) values ($1, $2, $3, $4);", [req.user.id, Date.now(), req.body.domain, req.body.favicon,])
        .then(function (_) {
        return res.status(200).send({ status: "Successfully added report." });
    })
        .catch(function (error) {
        return res.status(500).send({ status: "Failed to put report. Try again later." });
    });
});
router.get('/api/report', token_1.default, (0, mustHaveRole_1.default)(Roles_1.default.Verified), (0, mustHaveRole_1.default)(Roles_1.default.Paid), function (req, res, next) {
    var oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    database_1.db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1 AND time_stamp > $2;", [req.user.id, oneDayAgo,])
        .then(function (reports) {
        reports.sort(function (a, b) { return a.time_stamp < b.time_stamp; });
        return res.status(200).send({ status: "Successfully got reports.", reports: reports, });
    })
        .catch(function (error) {
        return res.status(500).send({ status: "Failed to get reports. Try again later." });
    });
});
router.post('/api/insights', token_1.default, (0, mustHaveRole_1.default)(Roles_1.default.Verified), (0, mustHaveRole_1.default)(Roles_1.default.Paid), function (req, res, next) {
    if (!req.body.hasOwnProperty("messages")) {
        return res.status(400).send({ status: "Failed to get insights. Include all fields before submitting." });
    }
    var oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    database_1.db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1  AND time_stamp > $2;", [req.user.id, oneDayAgo,])
        .then(function (reports) {
        if (reports.length < parseInt(process.env.LLM_MIN_REVIEWS)) {
            return res.status(200).send({ status: "Successfully generated insights.", insights: "Too few datapoints. Try again when you've used Pomelo for longer.", });
        }
        database_1.db.any("SELECT domain, starttime AS start, stoptime AS stop FROM rules WHERE user_id = $1;", [req.user.id])
            .then(function (rules) {
            var minIndex = Math.max(0, reports.length - parseInt(process.env.LLM_SERVER_MAX_REPORTS));
            var maxIndex = reports.length;
            var body = {
                reports: reports
                    .slice(minIndex, maxIndex)
                    .map(function (report) {
                    var date = new Date(parseInt(report.time_stamp));
                    return {
                        domain: report.domain,
                        timestamp: (date.toDateString() + " " + date.toLocaleTimeString()),
                    };
                }),
                rules: rules.map(function (rule) {
                    return {
                        domain: rule.domain,
                        start: "".concat(((rule.start + 1) > 12) ? (rule.start + 1 - 12) : (rule.start + 1)).concat((rule.start < 11 || rule.start == 23) ? "AM" : "PM"),
                        stop: "".concat(((rule.stop + 1) > 12) ? (rule.stop + 1 - 12) : (rule.stop + 1)).concat((rule.stop < 11 || rule.stop == 23) ? "AM" : "PM"),
                    };
                }),
                conversation: req.body.messages.map(function (message) {
                    return {
                        user: message.me,
                        text: message.message,
                    };
                }),
            };
            var client = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
            var params = {
                messages: [
                    {
                        role: "system",
                        content: process.env.OPENAI_SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: JSON.stringify(body),
                    }
                ],
                model: process.env.OPENAI_MODEL,
            };
            client.chat.completions.create(params)
                .then(function (chatCompletion) {
                if (chatCompletion.choices.length > 0 &&
                    !chatCompletion.choices[0].message.refusal) {
                    return res.status(200).send({ status: "Successfully generated insights.", insights: chatCompletion.choices[0].message.content, });
                }
                else {
                    return res.status(500).send({ status: "Failed to get insights. Try again later." });
                }
            })
                .catch(function (error) {
                return res.status(500).send({ status: "Failed to get insights. Try again later." });
            });
        })
            .catch(function (error) {
            return res.status(500).send({ status: "Failed to get insights. Try again later." });
        });
    })
        .catch(function (error) {
        return res.status(500).send({ status: "Failed to get insights. Try again later." });
    });
});
