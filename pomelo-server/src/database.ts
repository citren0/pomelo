const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pgp = require('pg-promise')();

// Environment setup.
dotenv.config();

var db;

function connectToDatabase()
{
    // DB setup.
    const auth_db_config = {
        user: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        capSQL: true,
        connect: (e) => {
            console.log("Successfully connected to the database: " + e.client.connectionParameters.database);
        },
        disconnect: (e) => {
            console.log("Disconnected from the database: " + e.client.connectionParameters.database);
        },
    };
    db = pgp(auth_db_config);
}


export { connectToDatabase, db }