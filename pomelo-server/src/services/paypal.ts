
const dotenv = require("dotenv");
const fs = require("fs");
const crypto = require("crypto");
const crc32 = require("buffer-crc32");

import { PaypalSubscriptionStatus } from "../models/PaypalSubscriptionStatus";
import { checkStatusCode } from "./statusCode";

const _importDynamic = new Function('modulePath', 'return import(modulePath)');
export const fetch = async function (...args: any)
{
    const {default: fetch} = await _importDynamic('node-fetch');
    return fetch(...args);
}

// Environment setup.
dotenv.config();


export const downloadAndCache = async (url) =>
{
    return new Promise<any>((resolve, reject) =>
    {
        const cacheKey = url.replace(/\W+/g, '-')
        const filePath = `./${cacheKey}`;

        // Check if cached file exists
        fs.readFile(filePath, 'utf-8', (err, data) =>
        {
            if (!err)
            {
                resolve(data);
            }

            // Download the file if not cached
            fetch(url)
            .then((data) => data.text())
            .then((response) =>
            {
                fs.writeFile(filePath, response, () => {});
                resolve(response);
            })
            .catch((_) =>
            {
                resolve(_);
            });

        });

    });

};


export const verifySignature = async (event, headers) =>
{
    const transmissionId = headers['paypal-transmission-id'];
    const timeStamp = headers['paypal-transmission-time'];
    const crc = parseInt("0x" + crc32(JSON.stringify(event)).toString("hex"));

    const message = `${transmissionId}|${timeStamp}|3RH04753AV665141L|${crc}`;

    const certPem = await downloadAndCache(headers['paypal-cert-url']);

    // Create buffer from base64-encoded signature
    const signatureBuffer = Buffer.from(headers['paypal-transmission-sig'], 'base64');

    // Create a verification object
    const verifier = crypto.createVerify('SHA256');

    // Add the original message to the verifier
    verifier.update(message);

    return verifier.verify(certPem, signatureBuffer);
};


// Authenticate to Paypal REST APIs
const generateAccessToken = async () =>
{
    try
    {
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET)
        {
            throw new Error("MISSING_API_CREDENTIALS");
        }

        // Basic auth.
        const auth = Buffer.from(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET).toString("base64");

        const response = await fetch(process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
        {
            method: "POST",
            body: "grant_type=client_credentials",
            headers:
            {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json() as any;
        return data.access_token;
    }
    catch (error)
    {
        console.error("Failed to generate Access Token:", error);
    }

};


export const getSubscriptionStatus = async (subscription_id) =>
{
    const accessToken = await generateAccessToken();

    const subscriptionDetailsUrl = process.env.PAYPAL_BASE_URL + "/v1/billing/subscriptions/" + subscription_id;

    const subscriptionDetails = await fetch(subscriptionDetailsUrl,
    {
        headers:
        {
            Authorization: `Bearer ${accessToken}`,
        },
        method: "GET",
    });

    const subscriptionDetailsJson = subscriptionDetails.json();

    const subscriptionStatus: PaypalSubscriptionStatus = await subscriptionDetailsJson.status;

    return subscriptionStatus;
};


export const cancelSubscription = async (subscription_id) =>
{
    const accessToken = await generateAccessToken();

    const cancelSubscriptionUrl = process.env.PAYPAL_BASE_URL + "/v1/billing/subscriptions/" + subscription_id + "/cancel";

    const subscriptionDetails = await fetch(cancelSubscriptionUrl,
    {
        headers:
        {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ reason: "No reason given." }),
    });

    return checkStatusCode(subscriptionDetails.status);
};
