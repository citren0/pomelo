const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

import { db } from "../database";
import { WebhookEvent } from "../models/WebhookEvent";
import { verifySignature } from "../services/paypal";
import Roles from "../models/Roles";
import { createSubscription, deleteSubscription, givePaidRole, removePaidRole } from "../services/subscription";

// Environment setup.
dotenv.config();


const handleWebhook = (hookBody: any) =>
{
    // Paid role is used to determine if the user actually can access the resources.
    // Subscription table is used to find information about a user's subscription so they can cancel or suspend it.
    switch (hookBody.event_type)
    {
        case WebhookEvent.ACTIVATED:
            givePaidRole(hookBody.resource.custom_id);
            return;

        case WebhookEvent.CANCELLED:
            deleteSubscription(hookBody);
            removePaidRole(hookBody.resource.custom_id);
            return;

        case WebhookEvent.CREATED:
            createSubscription(hookBody);
            return;

        case WebhookEvent.EXPIRED:
            removePaidRole(hookBody.resource.custom_id);
            return;

        case WebhookEvent.PAYMENT_FAILED:
            removePaidRole(hookBody.resource.custom_id);
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