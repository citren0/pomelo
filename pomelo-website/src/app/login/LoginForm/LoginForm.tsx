
"use client";

import React, { useEffect, useState } from "react";
import { Message, SimpleInput } from "../../../components";
import "./LoginForm.css";
import config from "../../../constants/config";
import { checkStatusCode } from "../../../services/checkStatusCode";
import MessageTypes from "@/constants/messageTypes";
import { getURLParameter } from "@/services/getURLParameters";


const LoginForm = () =>
{
    const [ username, setUsername ] = useState("");
	const [ password, setPassword ] = useState("");

    const [ isError, setIsError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const [ isInfo, setIsInfo ] = useState(false);
    const [ infoMessage, setInfoMessage ] = useState("");

    useEffect(() =>
    {
        // Check for registration.
        const href = window.location.href;

        if (href.includes("registered"))
        {
            setIsInfo(true);
            setInfoMessage(getURLParameter("registered") ?? "Registration successful.");
        }
    });

    const login = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        
        setIsError(false);

        const loginRequestBody =
        {
            username: username,
            password: password,
        };

        fetch(config.loginURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginRequestBody)
        })
        .then(async (loginResponse) =>
        {
            const loginResponseJson = await loginResponse.json();

            if (!checkStatusCode(loginResponse.status))
            {
                setIsError(true);
                setErrorMessage(loginResponseJson.status);
            }
            else
            {
                const token = loginResponseJson.token;

                window.localStorage.setItem('token', token);
                
                window.location.href = "/profile";
            }

        });

    };
    
    return (
        <>
            <form
                className="login-form"
                onSubmit={login}
            >
                <span className="login-form-title">Login</span>
                <hr className="hr-100"/>

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
                    type="password"
                    label={"Password"}
                    id="password"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <button type="submit">Login</button>
                <a href="/register">Register</a>
            </form>
        </>
    );
};

export default LoginForm;
