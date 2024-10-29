const dotenv = require('dotenv');
const nodemailer = require("nodemailer");

dotenv.config();

const transporter = nodemailer.createTransport(
{
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth:
    {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendMail = (recipient: string, subject: string, body: string): Promise<void> =>
{
    return new Promise(async (resolve, reject) =>
    {
        // send mail with defined transport object
        transporter.sendMail(
        {
            from: {
                name: "Pomelo Productivity",
                address: process.env.MAIL_USER,
            },
            to: recipient,
            subject: subject,
            text: body,
            html: body,
        }, (err: any, info: any) =>
        {
            if (err)
            {
                reject();
            }
            else
            {
                resolve();
            }

        });

    });

}

export default sendMail;