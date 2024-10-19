"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
var auth = function (req, res, next) {
    var authHeader = String(req.header('Authorization'));
    var splitAuthHeader = authHeader.split(' ');
    if ((authHeader == undefined) || (splitAuthHeader.length != 2)) {
        return res.status(401).send({ status: "Unauthorized, please log in.", isLoggedIn: false, });
    }
    jwt.verify(splitAuthHeader[1], process.env.AUTH_SECRET, function (err, user) {
        if (err) {
            return res.status(401).send({ status: "Unauthorized, please log in.", isLoggedIn: false, });
        }
        req.user = user;
        return next();
    });
};
exports.default = auth;
