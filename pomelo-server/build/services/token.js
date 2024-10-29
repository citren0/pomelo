"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
var auth = function (req, res, next) {
    var _a;
    var authHeader = String((_a = req.header('Authorization')) !== null && _a !== void 0 ? _a : "");
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
