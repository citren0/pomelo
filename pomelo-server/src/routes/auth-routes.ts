const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

import { db } from '../database';
import { JWTPayload } from '../models/JWTPayload';
import Roles from '../models/Roles';
import auth from "../services/token";
import createAndSendEmailVerification from '../services/emailVerificationToken';

// Environment setup.
dotenv.config();


router.put('/api/register', (req, res, next) =>
{
    if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password") || !req.body.hasOwnProperty("email"))
    {
        return res.status(400).send({ status: "Failed to register user. Provide all fields when submitting." });
    }

    if (typeof req.body.username != "string" ||
        typeof req.body.password != "string" ||
        typeof req.body.email != "string")
    {
        return res.status(400).send({ status: "Failed to register user. Provide all fields when submitting." });
    }

    const minUsernameLength = 4;
    const maxUsernameLength = 16;
    const minPasswordLength = 8;
    const maxPasswordLength = 32;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;

    if (req.body.username.length < minUsernameLength ||
        req.body.username.length > maxUsernameLength)
    {
        return res.status(500).send({ status: "Failed to register user. Username is not valid." });
    }

    if (req.body.password.length < minPasswordLength ||
        req.body.password.length > maxPasswordLength ||
        !uppercase.test(req.body.password) ||
        !lowercase.test(req.body.password) ||
        !number.test(req.body.password))
    {
        return res.status(500).send({ status: "Failed to register user. Password is not valid." });
    }

    if (!req.body.email.includes("@") ||
        !req.body.email.includes("."))
    {
        return res.status(500).send({ status: "Failed to register user. Email is not valid." });
    }

    // Generate a salt then hash the password.
    bcrypt.hash(req.body.password, parseInt(process.env.PASSWORD_HASHING_ROUNDS))
    .then((hash: string) =>
    {
        db.any('insert into users (username, email, hash, registration) values (lower($1), lower($2), $3, $4) returning id;',
                [req.body.username, req.body.email, hash, Date.now()])
        .then((user) =>
        {
            // Send verification email.
            createAndSendEmailVerification(user[0].id, req.body.email)
            .then((_) =>
            {
                return res.status(200).send({ status: "Successfully registered. You can log in now." });
            })
            .catch((error) =>
            {
                // Teardown.
                db.any("DELETE FROM users WHERE id = $1;", [user[0].id]);

                return res.status(500).send({ status: "Failed to register user. Try again later." });
            });

        })
        .catch((error) =>
        {
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

    if (typeof req.body.username != "string" ||
        typeof req.body.password != "string")
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

        // Check user's login attempts
        db.any("SELECT count(*) as count FROM login_attempts WHERE user_id = $1 AND time_stamp > $2 AND success = False;",
                [user[0].id, (Date.now() - parseInt(process.env.AUTH_MAX_LOGIN_ATTEMPTS_TIME))])
        .then((attempts) =>
        {
            if (attempts[0].count > parseInt(process.env.AUTH_MAX_LOGIN_ATTEMPTS))
            {
                return res.status(401).send({ status: "Failed to log in. Too many attempts. Wait 3 minutes and try again." });
            }

            bcrypt.compare(req.body.password, user[0].hash, (error, result) =>
            {
                if (!!error)
                {
                    return res.status(500).send({ status: "Failed to log in. Try again later." });
                }

                if (result == true)
                {
                    // Password is valid. Get user's roles.
                    db.any("select roles.name from user_to_role inner join roles on user_to_role.role_id = roles.id where user_id = $1;",
                            [user[0].id])
                    .then((user_roles) =>
                    {
                        // Log successful login attempt.
                        db.any("INSERT INTO login_attempts (user_id, time_stamp, success) values ($1, $2, $3);", [user[0].id, Date.now(), true]);

                        const mapped_roles = user_roles.map((user_role) => user_role.name);

                        const auth_payload: JWTPayload = {
                            username: req.body.username,
                            email: user[0].email,
                            id: user[0].id,
                            registration: user[0].registration,
                            roles: mapped_roles,
                        };
        
                        const auth_token = jwt.sign(auth_payload, process.env.AUTH_SECRET, { expiresIn: process.env.AUTH_JWT_EXPIRE_AGE, });
                        
                        return res.status(200).send(
                        {
                            status: "Successfully logged in.",
                            token: auth_token,
                            isVerified: mapped_roles.includes(Roles.Verified),
                            paid: mapped_roles.includes(Roles.Paid),
                        });

                    })
                    .catch((_) =>
                    {
                        return res.status(500).send({ status: "Failed to log in. Try again later." });
                    });

                }
                else
                {
                    // Log unsuccessful login attempt.
                    db.any("INSERT INTO login_attempts (user_id, time_stamp, success) values ($1, $2, $3);", [user[0].id, Date.now(), false]);

                    return res.status(401).send({ status: "Failed to log in. Username or password invalid." });
                }

            });

        })
        .catch((_) =>
        {
            return res.status(500).send({ status: "Failed to log in. Try again later." });
        });

    })
    .catch((_) =>
    {
        return res.status(500).send({ status: "Failed to log in. Try again later." });
    });
    
});


router.get("/api/newtoken", auth, (req, res, next) =>
{
    db.any('select username, id, email, hash, registration from users where id = $1;',
            [req.user.id])
    .then((user) =>
    {
        if (user.length != 1)
        {
            return res.status(400).send({ status: "Failed to issue token. Try again later." });
        }

        // Get user's roles.
        db.any("select roles.name from user_to_role inner join roles on user_to_role.role_id = roles.id where user_id = $1;",
                [user[0].id])
        .then((user_roles) =>
        {
            const mapped_roles = user_roles.map((user_role) => user_role.name);

            const auth_payload: JWTPayload = {
                username: user[0].username,
                email: user[0].email,
                id: user[0].id,
                registration: user[0].registration,
                roles: mapped_roles,
            };

            const auth_token = jwt.sign(auth_payload, process.env.AUTH_SECRET, {expiresIn: process.env.AUTH_JWT_EXPIRE_AGE, });
            
            return res.status(200).send({ status: "Successfully issued token.", token: auth_token, });
        })
        .catch((_) =>
        {
            return res.status(500).send({ status: "Failed to issue token. Try again later." });
        });

    })
    .catch((_) =>
    {
        return res.status(500).send({ status: "Failed to issue token. Try again later." });
    });

});


export { router };