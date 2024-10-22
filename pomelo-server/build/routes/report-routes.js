"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express = require('express');
var dotenv = require('dotenv');
var fetch = require("node-fetch");
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
    database_1.db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1;", [req.user.id,])
        .then(function (reports) {
        return res.status(200).send({ status: "Successfully got reports.", reports: reports, });
    })
        .catch(function (error) {
        return res.status(500).send({ status: "Failed to get reports. Try again later." });
    });
});
router.get('/api/insights', token_1.default, function (req, res, next) {
    // User verified, add report to db.
    database_1.db.any("SELECT time_stamp, domain, faviconUrl from web_activity WHERE userid = $1;", [req.user.id,])
        .then(function (reports) {
        var minIndex = Math.max(0, reports.length - parseInt(process.env.LLM_SERVER_MAX_REPORTS));
        var maxIndex = reports.length;
        var body = {
            text: reports
                .slice(minIndex, maxIndex)
                .map(function (report) {
                var date = new Date(parseInt(report.time_stamp));
                return {
                    domain: report.domain,
                    timestamp: (date.toDateString() + " " + date.toLocaleTimeString()),
                };
            }),
        };
        console.log(body);
        fetch(process.env.LLM_SERVER_ENDPOINT, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(function (response) { return __awaiter(void 0, void 0, void 0, function () {
            var insights;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, response.text()];
                    case 1:
                        insights = _a.sent();
                        return [2 /*return*/, res.status(200).send({ status: "Successfully generated insights.", insights: insights, })];
                }
            });
        }); })
            .catch(function (error) {
            console.log(error);
            return res.status(500).send({ status: "Failed to get insights. Try again later." });
        });
    })
        .catch(function (error) {
        console.log(error);
        return res.status(500).send({ status: "Failed to get insights. Try again later." });
    });
});
