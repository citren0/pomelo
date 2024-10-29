
"use client";

import { useState } from "react";
import "./ResetPasswordForm.css";
import MessageTypes from "@/constants/messageTypes";
import { InputError, Message, SimpleInput } from "@/components";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";


const ResetPasswordForm = () =>
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const [ isInfo, setIsInfo ] = useState<boolean>(false);
    const [ infoMessage, setInfoMessage ] = useState<string>("");

    const [ username, setUsername ] = useState<string>("");
    const [ token, setToken ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const [ passwordValid, setPasswordValid ] = useState<boolean>(true);
    
    const passwordChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newPassword = e.currentTarget.value;

        const lowercase = /[a-z]/;
        const uppercase = /[A-Z]/;
        const number = /[0-9]/;
        const minLength = 8;

        if (lowercase.test(newPassword) &&
            uppercase.test(newPassword) &&
            number.test(newPassword) &&
            newPassword.length >= minLength)
        {
            setPasswordValid(true);
        }
        else
        {
            setPasswordValid(false);
        }

        setPassword(newPassword);
    };

    const resetPassword = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();

        setIsError(false);
        setIsInfo(false);

        const resetPasswordBody =
        {
            username: username,
            token: token,
            password: password,
        };

        fetch(config.resetPasswordURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resetPasswordBody)
        })
        .then(async (resetPasswordResponse) =>
        {
            const resetPasswordResponseJson = await resetPasswordResponse.json();

            if (!checkStatusCode(resetPasswordResponse.status))
            {
                setIsError(true);
                setErrorMessage(resetPasswordResponseJson.status);
            }
            else
            {
                setIsInfo(true);
                setInfoMessage(resetPasswordResponseJson.status);
            }

        });
    };

    return (
        <>
            <form
                className="form-popout"
                onSubmit={resetPassword}
            >
                <div>
                    <span className="form-title">Reset Password</span>
                    <hr className="hr-100"/>
                    <span className="form-subtext">Use the code sent to your email then create a new password.</span>
                </div>

                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }

                { isInfo && <>
                    <Message type={MessageTypes.Info} message={infoMessage} />
                </> }

                <SimpleInput
                    type="text"
                    label={"Username"}
                    id="username"
                    placeholder="JohnDoe"
                    onChange={(e) => setUsername(e.currentTarget.value)}
                />

                <SimpleInput
                    type="text"
                    label={"Token"}
                    id="token"
                    placeholder="1234567"
                    onChange={(e) => setToken(e.currentTarget.value)}
                />

                <SimpleInput
                    type="password"
                    label={"New Password"}
                    id="password"
                    placeholder="••••••••"
                    onChange={passwordChanged}
                />

                { !passwordValid && <>
                    <InputError text="Passwords must contain at least 1 uppercase, lowercase, and number and be 8 characters or longer." />
                </> }

                <button
                    type="submit"
                    className="form-primary-button"
                    disabled={(!passwordValid || username == "" || token == "" || password == "")}
                >
                    Reset Password
                </button>
                <a href="/forgotpassword" className="form-subtle-button">Need a Code?</a>
            </form>
        </>
    );
};

export default ResetPasswordForm;