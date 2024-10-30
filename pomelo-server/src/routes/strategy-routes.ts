const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

import { db } from '../database';
import auth from "../services/token";

// Environment setup.
dotenv.config();


router.post('/api/strategy', auth, (req, res, next) =>
{
    if (!req.body.hasOwnProperty("strategy"))
    {
        return res.status(400).send({ status: "Failed to update strategy. Include all fields before submitting." });
    }

    if (typeof req.body.strategy != "string")
    {
        return res.status(400).send({ status: "Failed to update strategy. Include all fields before submitting." });
    }

    // Does user 
    db.any("SELECT strategy FROM productivity_strategy WHERE user_id = $1;",
            [req.user.id])
    .then((existing_strategy) =>
    {
        if (existing_strategy.length == 0)
        {
            // Insert
            db.any("INSERT INTO productivity_strategy (user_id, strategy) VALUES ($1, $2);",
                    [req.user.id, req.body.strategy])
            .then((_) =>
            {
                return res.status(200).send({ status: "Successfully updated strategy." });
            })
            .catch((error) =>
            {
                return res.status(500).send({ status: "Failed to update strategy. Try again later." });
            });

        }
        else
        {
            // Update
            db.any("UPDATE productivity_strategy SET strategy = $1 WHERE user_id = $2;",
                    [req.body.strategy, req.user.id])
            .then((_) =>
            {
                return res.status(200).send({ status: "Successfully updated strategy." });
            })
            .catch((error) =>
            {
                return res.status(500).send({ status: "Failed to update strategy. Try again later." });
            });

        }

    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to update strategy. Try again later." });
    });

});


router.get("/api/strategy", auth, (req, res, next) =>
{
    db.any("SELECT strategy FROM productivity_strategy WHERE user_id = $1;",
            [req.user.id])
    .then((strategy) =>
    {
        return res.status(200).send({ status: "Successfully got strategy.", strategy: strategy[0].strategy, });
    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to get strategy. Try again later", });
    });
    
});


export { router };