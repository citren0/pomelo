import { db } from "../database";
import sendMail from "../email";
import generateToken from "./generateToken";

const createAndSendForgotPasswordEmail = (user_id: number, user_email: string) =>
{
    return new Promise<void>((resolve, reject) =>
    {
        // Delete any tokens.
        db.any("DELETE FROM forgot_password WHERE user_id = $1;",
                [user_id])
        .then((_) =>
        {
            const token = generateToken(parseInt(process.env.EMAIL_TOKEN_LENGTH));

            // Insert email verification token.
            db.any("INSERT INTO forgot_password (user_id, token, time_stamp) values ($1, $2, $3);",
                    [user_id, token, Date.now()])
            .then((_) =>
            {
                sendMail(
                    user_email,
                    "Reset Your Password with Pomelo",
                    "Use this code to reset your password: " + token + ".\nIf you did not request this code, you can safely ignore this email."
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

export default createAndSendForgotPasswordEmail;