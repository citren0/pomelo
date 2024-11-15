const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

import { db } from '../database';
import Roles from '../models/Roles';
import auth from '../services/token';
import createAndSendEmailVerification from '../services/emailVerificationToken';


// Environment setup.
dotenv.config();


router.post('/api/verifyemail', auth, (req, res, next) =>
{
    if (!req.body.hasOwnProperty("code"))
    {
        return res.status(400).send({ status: "Failed to verify email. Provide all fields when submitting." });
    }

    if (typeof req.body.code != "string")
    {
        return res.status(400).send({ status: "Failed to verify email. Provide all fields when submitting." });
    }

    db.any('DELETE FROM email_verification WHERE user_id = $1 AND token = $2 RETURNING token;',
            [req.user.id, req.body.code])
    .then((token) =>
    {
        if (token.length != 0)
        {
            // Token was valid if the query returned anything.
            db.any("SELECT id FROM roles WHERE name = $1;",
                    [Roles.Verified])
            .then((role_id) =>
            {
                db.any("INSERT INTO user_to_role (user_id, role_id) values ($1, $2);",
                        [req.user.id, role_id[0].id])
                .then((_) =>
                {
                    return res.status(200).send({ status: "Successfully verified email." });
                })
                .catch((error) =>
                {
                    return res.status(500).send({ status: "Failed to verify email. Try again later." });
                });

            })
            .catch((error) =>
            {
                return res.status(500).send({ status: "Failed to verify email. Try again later." });
            });
            
        }
        else
        {
            return res.status(401).send({ status: "Failed to verify email. Code is invalid." });
        }

    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to verify email. Try again later." });
    });

});


router.post('/api/resendemail', auth, (req, res, next) =>
{
    db.any("SELECT id, email FROM users WHERE id = $1;", 
            [req.user.id])
    .then((user) =>
    {
        // User cannot send verification email if they are already verified.
        if (!req.user.roles.includes(Roles.Verified))
        {
            // Send verification email.
            createAndSendEmailVerification(user[0].id, user[0].email)
            .then((_) =>
            {
                return res.status(200).send({ status: "Successfully resent email code." });
            })
            .catch((error) =>
            {
                return res.status(500).send({ status: "Failed to register user. Try again later." });
            });

        }
        else
        {
            return res.status(400).send({ status: "Failed to register user. You are already verified." });
        }

    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to register user. Try again later." });
    });

});


export { router };