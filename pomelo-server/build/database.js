"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.connectToDatabase = void 0;
var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
var jwt = require('jsonwebtoken');
var pgp = require('pg-promise')();
// Environment setup.
dotenv.config();
var db;
function connectToDatabase() {
    // DB setup.
    var auth_db_config = {
        user: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        max: 30,
        capSQL: true,
        connect: function (e) {
            console.log("Successfully connected to the database: " + e.client.connectionParameters.database);
        },
        disconnect: function (e) {
            console.log("Disconnected from the database: " + e.client.connectionParameters.database);
        },
    };
    exports.db = db = pgp(auth_db_config);
}
exports.connectToDatabase = connectToDatabase;
