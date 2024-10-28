import { db } from "../database";
import sendMail from "../email";
import generateToken from "./generateToken";

const createAndSendEmailVerification = (user_id: number, user_email: string) =>
{
    return new Promise<void>((resolve, reject) =>
    {
        // Delete any tokens.
        db.any("DELETE FROM email_verification WHERE user_id = $1;",
                [user_id])
        .then((_) =>
        {
            const token = generateToken(parseInt(process.env.EMAIL_TOKEN_LENGTH));

            // Insert email verification token.
            db.any("INSERT INTO email_verification (user_id, token) values ($1, $2);",
                    [user_id, token])
            .then((_) =>
            {
                sendMail(
                    user_email,
                    "Finish registering with Pomelo",
                    "Use this code to verify your email: " + token + ".\nIf you did not request this code, you can safely ignore this email."
                )
                .then((_) =>
                {
                    resolve();
                })
                .catch((error) =>
                {
                    reject();
                });

            })
            .catch((error) =>
            {
                reject();
            });
        })
        .catch((error) =>
        {
            reject();
        });

    });
    
};

export default createAndSendEmailVerification;