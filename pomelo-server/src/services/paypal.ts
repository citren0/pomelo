const dotenv = require("dotenv");

const _importDynamic = new Function('modulePath', 'return import(modulePath)');

export const fetch = async function (...args: any)
{
    const {default: fetch} = await _importDynamic('node-fetch');
    return fetch(...args);
}

// Environment setup.
dotenv.config();


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


// Create order to start transaction.
export const createOrder = async (cart) =>
{
    const accessToken = await generateAccessToken();
    const createOrderUrl = process.env.PAYPAL_BASE_URL + "/v2/checkout/orders";

    if (cart.length != 1 ||
        cart[0].quantity != "1")
    {
        return { status: 400, message: "Invalid cart selection. Try again later." };
    }
    else
    {
        const payload =
        {
            intent: "CAPTURE",
            purchase_units:
            [
                {
                    amount:
                    {
                        currency_code: "USD",
                        value: "10.00",
                    },
    
                },
    
            ],
            application_context:
            {
                shipping_preference: 'NO_SHIPPING'
            },
    
        };
    
        const createOrderResponse = await fetch(createOrderUrl,
        {
            headers:
            {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });
    
        const createOrderResponseJson = await createOrderResponse.json();
    
        return { ...createOrderResponseJson, status: createOrderResponse.status };
    }

};


// Capture order to finish transaction.
export const captureOrder = async (orderID) =>
{
    const accessToken = await generateAccessToken();
    const captureOrderUrl = process.env.PAYPAL_BASE_URL + "/v2/checkout/orders/" + orderID + "/capture";

    const captureOrderResponse = await fetch(captureOrderUrl,
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const captureOrderResponseJson = await captureOrderResponse.json();

    return { ...captureOrderResponseJson, status: captureOrderResponse.status };
};