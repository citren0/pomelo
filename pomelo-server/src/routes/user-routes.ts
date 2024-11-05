const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");

import { JWTPayload } from '../models/JWTPayload';

// Environment setup.
dotenv.config();

router.use(cookieParser());


router.get('/api/userdetails', (req, res, next) =>
{
    const authHeader = String(req.header('Authorization') ?? "");
    const splitAuthHeader = authHeader.split(' ');
    
    if ((authHeader == undefined) || (splitAuthHeader.length != 2))
    {
        return res.status(401).send({ status: "Are you sure you're logged in?", isLoggedIn: false, });
    }

    jwt.verify(splitAuthHeader[1], process.env.AUTH_SECRET, (err: any, user: JWTPayload) =>
    {
        if (err)
        {
            return res.status(401).send({ status: "Are you sure you're logged in?", isLoggedIn: false, });
        }

        return res.status(200).send({ isLoggedIn: true, user: user, });
    });

});


export { router };