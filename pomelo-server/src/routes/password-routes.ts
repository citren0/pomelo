const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

import { db } from '../database';
import createAndSendForgotPasswordEmail from '../services/forgotPasswordToken';


// Environment setup.
dotenv.config();


router.post('/api/forgotpassword', (req, res, next) =>
{
    if (!req.body.hasOwnProperty("username"))
    {
        return res.status(400).send({ status: "Failed to send password reset email. Provide all fields before submitting." });
    }

    if (typeof req.body.username != "string")
    {
        return res.status(400).send({ status: "Failed to send password reset email. Provide all fields before submitting." });
    }

    db.any("SELECT id, email FROM users WHERE username = $1;", 
            [req.body.username])
    .then((user) =>
    {
        if (user.length != 1)
        {
            return res.status(400).send({ status: "Failed to send password reset email. User does not exist." });
        }

        // Send verification email.
        createAndSendForgotPasswordEmail(user[0].id, user[0].email)
        .then((_) =>
        {
            return res.status(200).send({ status: "Successfully sent email code." });
        })
        .catch((error) =>
        {
            return res.status(500).send({ status: "Failed to send password reset email. Try again later." });
        });

    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to send password reset email. Try again later." });
    });

});


router.post("/api/resetpassword", (req, res, next) =>
{
    if (!req.body.hasOwnProperty("token") || !req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password"))
    {
        return res.status(400).send({ status: "Failed to reset password. Include all fields before submitting." });
    }

    if (typeof req.body.token != "string" ||
        typeof req.body.username != "string" ||
        typeof req.body.password != "string")
    {
        return res.status(400).send({ status: "Failed to reset password. Include all fields before submitting." });
    }

    // Check for password requirements.
    const minPasswordLength = 8;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;

    if (req.body.password.length < minPasswordLength || !uppercase.test(req.body.password) || !lowercase.test(req.body.password) || !number.test(req.body.password))
    {
        return res.status(500).send({ status: "Failed to reset password. Password is not valid." });
    }

    // Continue.
    db.any("SELECT id FROM users WHERE username = $1;", 
            [req.body.username])
    .then((user) =>
    {
        if (user.length != 1)
        {
            return res.status(400).send({ status: "Failed to reset password. User does not exist." });
        }

        // Check how many times people have tried to reset this password (success or failure).
        db.any("SELECT count(*) as count FROM forgot_password_attempts WHERE user_id = $1 AND time_stamp > $2;",
                [user[0].id, (Date.now() - parseInt(process.env.AUTH_MAX_RESET_PASSWORD_ATTEMPTS_TIME))])
        .then((attempts) =>
        {
            if (attempts[0].count > parseInt(process.env.AUTH_MAX_RESET_PASSWORD_ATTEMPTS))
            {
                return res.status(401).send({ status: "Failed to reset password. Too many attempts. Wait 5 minutes and try again." });
            }

            db.any("DELETE FROM forgot_password WHERE user_id = $1 AND token = $2 RETURNING user_id;",
                    [user[0].id, req.body.token])
            .then((entries) =>
            {
                if (entries.length == 1)
                {
                    // Success, log, hash the password.
                    db.any("INSERT INTO forgot_password_attempts (user_id, time_stamp, success) values ($1, $2, $3);",
                            [user[0].id, Date.now(), true]);

                    bcrypt.hash(req.body.password, 14)
                    .then((hash: string) =>
                    {
                        db.any("UPDATE users SET hash = $1 WHERE id = $2;",
                                [hash, user[0].id])
                        .then((_) =>
                        {
                            return res.status(200).send({ status: "Successfully reset password. You can log in now." });
                        })
                        .catch((error) =>
                        {
                            return res.status(500).send({ status: "Failed to reset password. Try again later." });
                        });

                    })
                    .catch((error) =>
                    {
                        return res.status(500).send({ status: "Failed to reset password. Try again later." });
                    });

                }
                else
                {
                    // Invalid token.
                    db.any("INSERT INTO forgot_password_attempts (user_id, time_stamp, success) values ($1, $2, $3);",
                            [user[0].id, Date.now(), false]);

                    return res.status(401).send({ status: "Failed to reset password. Token is invalid." });
                }

            })
            .catch((_) =>
            {
                return res.status(500).send({ status: "Failed to reset password. Try again later." });
            })

        })
        .catch((error) =>
        {

        });

    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to reset password. Try again later." });
    });

});


export { router };