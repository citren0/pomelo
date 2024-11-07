const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();

import { db } from "../database";
import mustHaveRole from "../services/mustHaveRole";
import auth from "../services/token";
import { WebhookEvent } from "../models/WebhookEvent";
import { cancelSubscription, getSubscriptionStatus, verifySignature } from "../services/paypal";
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


router.get('/api/subscription_status', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    db.any("SELECT subscription_id FROM subscriptions WHERE user_id = $1;",
            [req.user.id])
    .then((subscription_id) =>
    {
        if (subscription_id.length != 1)
        {
            return res.status(400).send({ status: "You do not have a subscription linked to your account." });
        }

        getSubscriptionStatus(subscription_id[0].subscription_id)
        .then((subscription_status) =>
        {
            return res.status(200).send({ status: "Successfully fetched subscription status.", subscriptionStatus: subscription_status, });
        })
        .catch((error) =>
        {
            return res.status(500).send({ status: "Failed to get subscription details. Try again later." });
        });

    })
    .catch((error) =>
    {
        return res.status(500).send({ status: "Failed to get subscription details. Try again later." });
    });

});


router.get('/api/cancel_subscription', auth, mustHaveRole(Roles.Verified), mustHaveRole(Roles.Paid), (req, res, next) =>
{
    db.any("SELECT id FROM roles WHERE name = $1;",
            [Roles.Paid])
    .then((roleId) =>
    {

        db.any("SELECT subscription_id FROM subscriptions WHERE user_id = $1;",
                [req.user.id])
        .then((subscription_id) =>
        {
            if (subscription_id.length != 1)
            {
                return res.status(400).send({ status: "You do not have a subscription linked to your account." });
            }

            cancelSubscription(subscription_id[0].subscription_id)
            .then((success) =>
            {
                if (success == true)
                {
                    return res.status(200).send({ status: "Successfully cancelled subscription.", });
                }
                else
                {
                    return res.status(500).send({ status: "Failed to cancel subscription. Try again later." });
                }
                
            })
            .catch((error) =>
            {
                return res.status(500).send({ status: "Failed to cancel subscription. Try again later." });
            });

        })
        .catch((error) =>
        {
            return res.status(500).send({ status: "Failed to cancel subscription. Try again later." });
        });

    })
    .catch((_) =>
    {
        return res.status(500).send({ status: "Failed to cancel subscription. Try again later." });
    });

});


export { router };