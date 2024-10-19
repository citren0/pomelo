const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

import { db } from '../database';
import { JWTPayload } from '../models/JWTPayload';

// Environment setup.
dotenv.config();


router.put('/api/register', (req, res, next) =>
{
    if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password") || !req.body.hasOwnProperty("email"))
    {
        return res.status(400).send({ status: "Failed to register user. Provide all fields when submitting." });
    }

    // Generate a salt then hash the password.
    bcrypt.hash(req.body.password, 14)
    .then((hash: string) =>
    {
        db.any('insert into users (username, email, hash, registration) values (lower($1), lower($2), $3, $4) returning id;',
                [req.body.username, req.body.email, hash, Date.now()])
        .then((user) =>
        {
            return res.status(200).send({ status: "Successfully registered." });
        })
        .catch((error) =>
        {
            console.log(error);
            return res.status(400).send({ status: "Failed to register user. Username or email already registered." });
        });

    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to register user. Try again later." });
    });

});


router.post('/api/login', (req, res, next) =>
{
    if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password"))
    {
        return res.status(400).send({ status: "Failed to log in. Provide all fields when submitting." });
    }

    db.any('select id, email, hash, registration from users where lower(username) = lower($1);',
            [req.body.username])
    .then((user) =>
    {
        if (user.length != 1)
        {
            return res.status(400).send({ status: "Failed to log in. Username or password invalid." });
        }

        bcrypt.compare(req.body.password, user[0].hash, (error, result) =>
        {
            if (!!error)
            {
                return res.status(500).send({ status: "Failed to log in. Try again later." });
            }

            if (result == true)
            {

                const auth_payload: JWTPayload = {
                    username: req.body.username,
                    email: user[0].email,
                    id: user[0].id,
                    registration: user[0].registration,
                };

                const auth_token = jwt.sign(auth_payload, process.env.AUTH_SECRET, {expiresIn: process.env.AUTH_JWT_EXPIRE_AGE, });
                
                return res.status(200).send({ status: "Successfully logged in.", token: auth_token, });

            }
            else
            {
                return res.status(401).send({ status: "Failed to log in. Username or password invalid." });
            }

        });

    })
    .catch((_) =>
    {
        return res.status(500).send({ status: "Failed to log in. Try again later." });
    });
    
});


export { router };