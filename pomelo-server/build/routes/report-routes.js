"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
exports.router = router;
var database_1 = require("../database");
var token_1 = require("../services/token");
// Environment setup.
dotenv.config();
router.post('/api/report', token_1.default, function (req, res, next) {
    if (!req.body.hasOwnProperty("domain") || !req.body.hasOwnProperty("favicon")) {
        return res.status(400).send({ status: "Include all fields before submitting.", });
    }
    // User verified, add report to db.
    database_1.db.any("INSERT INTO web_activity (userid, time_stamp, domain, faviconUrl) values ($1, $2, $3, $4);", [req.user.id, Date.now(), req.body.domain, req.body.favicon,])
        .then(function (_) {
        return res.status(200).send({ status: "Successfully added report." });
    })
        .catch(function (error) {
        return res.status(500).send({ status: "Failed to put report. Try again later." });
    });
});
router.get('/api/report', token_1.default, function (req, res, next) {
    // User verified, add report to db.
    database_1.db.any("SELECT userid, time_stamp, domain, faviconUrl from web_activity WHERE userid = $1;", [req.user.id,])
        .then(function (reports) {
        return res.status(200).send({ status: "Successfully got reports.", reports: reports, });
    })
        .catch(function (error) {
        return res.status(500).send({ status: "Failed to put report. Try again later." });
    });
});
