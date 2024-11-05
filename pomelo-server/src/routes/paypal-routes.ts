const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

import { db } from "../database";
import Roles from "../models/Roles";
import auth from "../services/token";
import mustHaveRole from "../services/mustHaveRole";
import { verifySignature } from "../services/paypal";
import { checkStatusCode } from "../services/statusCode";

// Environment setup.
dotenv.config();


router.post("/api/webhook", async (req, res, next) =>
{
    const isSignatureValid = await verifySignature(req.body, req.headers);

    if (isSignatureValid)
    {
        // Successful receipt of webhook.
        console.log(`Received event`, JSON.stringify(req.body, null, 2));
    }
    else
    {
        // Reject processing the webhook.
        console.log(`Signature is not valid for ${req.body?.id} ${req.headers?.['correlation-id']}`);
    }
  
    res.sendStatus(200);
});


export { router };