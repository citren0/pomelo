
const dotenv = require("dotenv");
const fs = require("fs");
const crypto = require("crypto");
const crc32 = require("buffer-crc32");

const _importDynamic = new Function('modulePath', 'return import(modulePath)');

export const fetch = async function (...args: any)
{
    const {default: fetch} = await _importDynamic('node-fetch');
    return fetch(...args);
}

// Environment setup.
dotenv.config();


// // Authenticate to Paypal REST APIs
// const generateAccessToken = async () =>
// {
//     try
//     {
//         if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET)
//         {
//             throw new Error("MISSING_API_CREDENTIALS");
//         }

//         // Basic auth.
//         const auth = Buffer.from(process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_CLIENT_SECRET).toString("base64");

//         const response = await fetch(process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
//         {
//             method: "POST",
//             body: "grant_type=client_credentials",
//             headers:
//             {
//                 Authorization: `Basic ${auth}`,
//             },
//         });

//         const data = await response.json() as any;
//         return data.access_token;
//     }
//     catch (error)
//     {
//         console.error("Failed to generate Access Token:", error);
//     }

// };


// // Create order to start transaction.
// export const createOrder = async (cart) =>
// {
//     const accessToken = await generateAccessToken();
//     const createOrderUrl = process.env.PAYPAL_BASE_URL + "/v2/checkout/orders";

//     if (cart.length != 1 ||
//         cart[0].quantity != "1")
//     {
//         return { status: 400, message: "Invalid cart selection. Try again later." };
//     }
//     else
//     {
//         const payload =
//         {
//             intent: "CAPTURE",
//             purchase_units:
//             [
//                 {
//                     amount:
//                     {
//                         currency_code: "USD",
//                         value: "10.00",
//                     },
    
//                 },
    
//             ],
//             application_context:
//             {
//                 shipping_preference: 'NO_SHIPPING'
//             },
    
//         };
    
//         const createOrderResponse = await fetch(createOrderUrl,
//         {
//             headers:
//             {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${accessToken}`,
//             },
//             method: "POST",
//             body: JSON.stringify(payload),
//         });
    
//         const createOrderResponseJson = await createOrderResponse.json();
    
//         return { ...createOrderResponseJson, status: createOrderResponse.status };
//     }

// };


// // Capture order to finish transaction.
// export const captureOrder = async (orderID) =>
// {
//     const accessToken = await generateAccessToken();
//     const captureOrderUrl = process.env.PAYPAL_BASE_URL + "/v2/checkout/orders/" + orderID + "/capture";

//     const captureOrderResponse = await fetch(captureOrderUrl,
//     {
//         method: "POST",
//         headers:
//         {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${accessToken}`,
//         },
//     });

//     const captureOrderResponseJson = await captureOrderResponse.json();

//     return { ...captureOrderResponseJson, status: captureOrderResponse.status };
// };


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
    const crc = parseInt("0x" + crc32(event).toString(16));

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