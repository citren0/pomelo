
"use client";

import { Message, SimpleInput } from "@/components";
import "./VerifyEmailForm.css";
import { ChangeEvent, FormEvent, useState } from "react";
import MessageTypes from "@/constants/messageTypes";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";
import getNewToken from "@/services/getNewToken";


const VerifyEmailForm = () =>
{
    const [ code, setCode ] = useState<string>("");
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ isSuccess, setIsSuccess ] = useState<boolean>(false);
    const [ successMessage, setSuccessMessage ] = useState<string>("");

    const verifyEmail = (e: FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();

        setIsError(false);

        const postVerifyEmailBody =
        {
            code: code,
        };

        fetch(config.baseURL + config.postVerifyEmail, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postVerifyEmailBody)
        })
        .then(async (postVerifyEmailResponse) =>
        {
            const postVerifyEmailResponseJson = await postVerifyEmailResponse.json();

            if (!checkStatusCode(postVerifyEmailResponse.status))
            {
                setIsError(true);
                setErrorMessage(postVerifyEmailResponseJson.status);
            }
            else
            {

                getNewToken()
                .then(() =>
                {
                    window.location.href = "/createorder";
                })
                .catch(() =>
                {
                    setIsError(true);
                    setErrorMessage("Failed to issue token. Log out and then log back in to fix this problem.");
                });
            }

        })
        .catch(() =>
        {
            setIsError(true);
            setErrorMessage("Failed to verify email. Try again later.");
        });

    };

    const resendEmail = () =>
    {
        setIsError(false);

        fetch(config.baseURL + config.postResendEmail, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            },
            body: ""
        })
        .then(async (postResendEmailResponse) =>
        {
            const postResendEmailResponseJson = await postResendEmailResponse.json();

            if (!checkStatusCode(postResendEmailResponse.status))
            {
                setIsError(true);
                setErrorMessage(postResendEmailResponseJson.status);
            }
            else
            {
                setIsSuccess(true);
                setSuccessMessage(postResendEmailResponseJson.status);
            }

        })
        .catch(() =>
        {
            setIsError(true);
            setErrorMessage("Failed to resend email. Try again later.")
        });

    };

    return (
        <>
            <form className="form-popout" onSubmit={verifyEmail}>
                <div className="form-top-wrapper">
                    <span className="form-title">Verify Your Email</span>
                    <hr className="hr-100"/>
                    <span className="form-subtext">Before you can use Pomelo, check your email for a verification code.</span>
                    <span className="form-subtext">If you don&apos;t see it, request another one.</span>
                </div>

                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }

                { isSuccess && <>
                    <Message type={MessageTypes.Info} message={successMessage} />
                </> }

                <SimpleInput
                    type="number"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => { setCode(e.currentTarget.value); }}
                    placeholder="1234567"
                    label="Verification Code"
                />

                <div className="form-buttons">
                    <button type="submit" className="form-primary-button">Verify Code</button>
                    <button type="button" onClick={resendEmail} className="form-secondary-button">Send Another Code</button>
                </div>
            </form>
        </>
    );
};

export default VerifyEmailForm;