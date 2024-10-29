
"use client";

import { useState } from "react";
import "./ForgotPasswordForm.css";
import MessageTypes from "@/constants/messageTypes";
import { Message, SimpleInput } from "@/components";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";


const ForgotPasswordForm = () =>
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ username, setUsername ] = useState<string>("");
    
    const forgotPassword = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();

        setIsError(false);

        const forgotPasswordBody =
        {
            username: username,
        };

        fetch(config.forgotPasswordURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(forgotPasswordBody)
        })
        .then(async (forgotPasswordResponse) =>
        {
            const forgotPasswordResponseJson = await forgotPasswordResponse.json();

            if (!checkStatusCode(forgotPasswordResponse.status))
            {
                setIsError(true);
                setErrorMessage(forgotPasswordResponseJson.status);
            }
            else
            {
                window.location.href = "/resetpassword";
            }

        });
    };

    return (
        <>
            <form
                className="form-popout"
                onSubmit={forgotPassword}
            >
                <div>
                    <span className="form-title">Forgot Password</span>
                    <hr className="hr-100"/>
                    <span className="form-subtext">Enter your username and then check your email for a code to reset your password.</span>
                </div>

                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }

                <SimpleInput
                    type="text"
                    label={"Username"}
                    id="username"
                    placeholder="JohnDoe"
                    onChange={(e) => setUsername(e.currentTarget.value)}
                />

                <button type="submit" className="form-primary-button" disabled={(username == "")}>Send Forgot Password Email</button>
                <a href="/resetpassword" className="form-subtle-button">Already Have a Code?</a>
            </form>
        </>
    );
};

export default ForgotPasswordForm;