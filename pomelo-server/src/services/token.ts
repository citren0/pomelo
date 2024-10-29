
const jwt = require('jsonwebtoken');

import { JWTPayload } from "../models/JWTPayload";

const auth = (req, res, next) =>
{
    const authHeader = String(req.header('Authorization') ?? "");
    const splitAuthHeader = authHeader.split(' ');
    
    if ((authHeader == undefined) || (splitAuthHeader.length != 2))
    {
        return res.status(401).send({ status: "Unauthorized, please log in.", isLoggedIn: false, });
    }

    jwt.verify(splitAuthHeader[1], process.env.AUTH_SECRET, (err: any, user: JWTPayload) =>
    {
        if (err)
        {
            return res.status(401).send({ status: "Unauthorized, please log in.", isLoggedIn: false, });
        }

        req.user = user;

        return next();
    });
};

export default auth;