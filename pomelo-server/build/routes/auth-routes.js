"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
exports.router = router;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var database_1 = require("../database");
var Roles_1 = require("../models/Roles");
var token_1 = require("../services/token");
var emailVerificationToken_1 = require("../services/emailVerificationToken");
// Environment setup.
dotenv.config();
router.put('/api/register', function (req, res, next) {
    if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password") || !req.body.hasOwnProperty("email")) {
        return res.status(400).send({ status: "Failed to register user. Provide all fields when submitting." });
    }
    if (typeof req.body.username != "string" ||
        typeof req.body.password != "string" ||
        typeof req.body.email != "string") {
        return res.status(400).send({ status: "Failed to register user. Provide all fields when submitting." });
    }
    var minUsernameLength = 4;
    var maxUsernameLength = 16;
    var minPasswordLength = 8;
    var uppercase = /[A-Z]/;
    var lowercase = /[a-z]/;
    var number = /[0-9]/;
    if (req.body.username.length < minUsernameLength || req.body.username.length > maxUsernameLength) {
        return res.status(500).send({ status: "Failed to register user. Username is not valid." });
    }
    if (req.body.password.length < minPasswordLength || !uppercase.test(req.body.password) || !lowercase.test(req.body.password) || !number.test(req.body.password)) {
        return res.status(500).send({ status: "Failed to register user. Password is not valid." });
    }
    if (!req.body.email.includes("@") ||
        !req.body.email.includes(".")) {
        return res.status(500).send({ status: "Failed to register user. Email is not valid." });
    }
    // Generate a salt then hash the password.
    bcrypt.hash(req.body.password, 14)
        .then(function (hash) {
        database_1.db.any('insert into users (username, email, hash, registration) values (lower($1), lower($2), $3, $4) returning id;', [req.body.username, req.body.email, hash, Date.now()])
            .then(function (user) {
            // Send verification email.
            (0, emailVerificationToken_1.default)(user[0].id, req.body.email)
                .then(function (_) {
                return res.status(200).send({ status: "Successfully registered. You can log in now." });
            })
                .catch(function (error) {
                // Teardown.
                database_1.db.any("DELETE FROM users WHERE id = $1;", [user[0].id]);
                return res.status(500).send({ status: "Failed to register user. Try again later." });
            });
        })
            .catch(function (error) {
            return res.status(400).send({ status: "Failed to register user. Username or email already registered." });
        });
    })
        .catch(function (error) {
        return res.status(500).send({ status: "Failed to register user. Try again later." });
    });
});
router.post('/api/login', function (req, res, next) {
    if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password")) {
        return res.status(400).send({ status: "Failed to log in. Provide all fields when submitting." });
    }
    if (typeof req.body.username != "string" ||
        typeof req.body.password != "string") {
        return res.status(400).send({ status: "Failed to log in. Provide all fields when submitting." });
    }
    database_1.db.any('select id, email, hash, registration from users where lower(username) = lower($1);', [req.body.username])
        .then(function (user) {
        if (user.length != 1) {
            return res.status(400).send({ status: "Failed to log in. Username or password invalid." });
        }
        // Check user's login attempts
        database_1.db.any("SELECT count(*) as count FROM login_attempts WHERE user_id = $1 AND time_stamp > $2 AND success = False;", [user[0].id, (Date.now() - parseInt(process.env.AUTH_MAX_LOGIN_ATTEMPTS_TIME))])
            .then(function (attempts) {
            if (attempts[0].count > parseInt(process.env.AUTH_MAX_LOGIN_ATTEMPTS)) {
                return res.status(401).send({ status: "Failed to log in. Too many attempts. Wait 3 minutes and try again." });
            }
            bcrypt.compare(req.body.password, user[0].hash, function (error, result) {
                if (!!error) {
                    return res.status(500).send({ status: "Failed to log in. Try again later." });
                }
                if (result == true) {
                    // Password is valid. Get user's roles.
                    database_1.db.any("select roles.name from user_to_role inner join roles on user_to_role.role_id = roles.id where user_id = $1;", [user[0].id])
                        .then(function (user_roles) {
                        // Log successful login attempt.
                        database_1.db.any("INSERT INTO login_attempts (user_id, time_stamp, success) values ($1, $2, $3);", [user[0].id, Date.now(), true]);
                        var mapped_roles = user_roles.map(function (user_role) { return user_role.name; });
                        var auth_payload = {
                            username: req.body.username,
                            email: user[0].email,
                            id: user[0].id,
                            registration: user[0].registration,
                            roles: mapped_roles,
                        };
                        var auth_token = jwt.sign(auth_payload, process.env.AUTH_SECRET, { expiresIn: process.env.AUTH_JWT_EXPIRE_AGE, });
                        return res.status(200).send({
                            status: "Successfully logged in.",
                            token: auth_token,
                            isVerified: mapped_roles.includes(Roles_1.default.Verified),
                        });
                    })
                        .catch(function (_) {
                        return res.status(500).send({ status: "Failed to log in. Try again later." });
                    });
                }
                else {
                    // Log unsuccessful login attempt.
                    database_1.db.any("INSERT INTO login_attempts (user_id, time_stamp, success) values ($1, $2, $3);", [user[0].id, Date.now(), false]);
                    return res.status(401).send({ status: "Failed to log in. Username or password invalid." });
                }
            });
        })
            .catch(function (_) {
            return res.status(500).send({ status: "Failed to log in. Try again later." });
        });
    })
        .catch(function (_) {
        return res.status(500).send({ status: "Failed to log in. Try again later." });
    });
});
router.get("/api/newtoken", token_1.default, function (req, res, next) {
    database_1.db.any('select username, id, email, hash, registration from users where lower(username) = lower($1);', [req.user.username])
        .then(function (user) {
        if (user.length != 1) {
            return res.status(400).send({ status: "Failed to issue token. Username or password invalid." });
        }
        // Get user's roles.
        database_1.db.any("select roles.name from user_to_role inner join roles on user_to_role.role_id = roles.id where user_id = $1;", [user[0].id])
            .then(function (user_roles) {
            var mapped_roles = user_roles.map(function (user_role) { return user_role.name; });
            var auth_payload = {
                username: user[0].username,
                email: user[0].email,
                id: user[0].id,
                registration: user[0].registration,
                roles: mapped_roles,
            };
            var auth_token = jwt.sign(auth_payload, process.env.AUTH_SECRET, { expiresIn: process.env.AUTH_JWT_EXPIRE_AGE, });
            return res.status(200).send({ status: "Successfully issued token.", token: auth_token, });
        })
            .catch(function (_) {
            return res.status(500).send({ status: "Failed to issue token. Try again later." });
        });
    })
        .catch(function (_) {
        return res.status(500).send({ status: "Failed to issue token. Try again later." });
    });
});
