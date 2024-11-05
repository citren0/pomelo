
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