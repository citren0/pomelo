const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

import { db } from "../database";
import { WebhookEvent } from "../models/WebhookEvent";
import { verifySignature } from "../services/paypal";
import Roles from "../models/Roles";

// Environment setup.
dotenv.config();


const givePaidRole = (user_id: number) =>
{
    db.any("SELECT id FROM roles WHERE name = $1;",
            [Roles.Paid])
    .then((role_id) =>
    {
        db.any("INSERT INTO user_to_role (user_id, role_id) VALUES ($1, $2);",
                [user_id, role_id[0].id]);
    })
    .catch((_) =>
    {
        // Handle error.
    });

};


const removePaidRole = (user_id: number) =>
{
    db.any("SELECT id FROM roles WHERE name = $1;",
            [Roles.Paid])
    .then((role_id) =>
    {
        db.any("DELETE FROM user_to_role WHERE user_id = $1 AND role_id = $2;",
                [user_id, role_id[0].id]);
    })
    .catch((_) =>
    {
        // Handle error.
    });

};


const handleWebhook = (hookBody: any) =>
{
    switch (hookBody.event_type)
    {
        case WebhookEvent.ACTIVATED:
            givePaidRole(hookBody.resource.custom_id);
            return;

        case WebhookEvent.CANCELLED:
            removePaidRole(hookBody.resource.custom_id);
            return;

        case WebhookEvent.CREATED:
            return;

        case WebhookEvent.EXPIRED:
            removePaidRole(hookBody.resource.custom_id);
            return;

        case WebhookEvent.PAYMENT_FAILED:
            return;

        case WebhookEvent.SUSPENDED:
            removePaidRole(hookBody.resource.custom_id);
            return;

        case WebhookEvent.UPDATED:
            return;

        default:
            return;
    }

};

router.post("/api/webhook", async (req, res, next) =>
{
    const isSignatureValid = await verifySignature(req.body, req.headers);

    if (isSignatureValid)
    {
        // Successful receipt of webhook.
        handleWebhook(req.body);
    }
    else
    {
        // Reject processing the webhook.
        console.log("Invalid webhook received.");
    }
  
    res.sendStatus(200);
});


export { router };