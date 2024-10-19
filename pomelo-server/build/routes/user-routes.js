"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
exports.router = router;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var cookieParser = require("cookie-parser");
// Environment setup.
dotenv.config();
router.use(cookieParser());
router.get('/api/userdetails', function (req, res, next) {
    var authHeader = String(req.header('Authorization'));
    var splitAuthHeader = authHeader.split(' ');
    if ((authHeader == undefined) || (splitAuthHeader.length != 2)) {
        return res.status(401).send({ status: "Are you sure you're logged in?", isLoggedIn: false, });
    }
    jwt.verify(splitAuthHeader[1], process.env.AUTH_SECRET, function (err, user) {
        if (err) {
            return res.status(401).send({ isLoggedIn: false, });
        }
        return res.status(200).send({ isLoggedIn: true, user: user, });
    });
});
