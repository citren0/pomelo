const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");

import { db } from "../database";
import auth from "../services/token";

// Environment setup.
dotenv.config();

router.use(cookieParser());


router.get('/api/userdetails', auth, (req, res, next) =>
{
    return res.status(200).send({ isLoggedIn: true, user: req.user, });
});


router.delete("/api/delete_account", auth, (req, res, next) =>
{
    db.any("SELECT subscription_id FROM subscriptions WHERE user_id = $1;",
            [req.user.id])
    .then((subscriptions) =>
    {
        if (subscriptions.length != 0)
        {
            return res.status(400).send({ status: "You must cancel your subscription before you can delete your account." });
        }

        db.any("DELETE FROM users WHERE id = $1;",
                [req.user.id])
        .then((_) =>
        {
            return res.status(200).send({ status: "Successfully deleted account." });
        })
        .catch((error) =>
        {
            return res.status(500).send({ status: "Failed to delete account. Try again later." });
        });
        
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to delete account. Try again later." });
    });

});


export { router };