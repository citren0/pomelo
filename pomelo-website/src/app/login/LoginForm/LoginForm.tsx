
"use client";

import React, { useEffect, useState } from "react";
import { Message, SimpleInput } from "../../../components";
import "./LoginForm.css";
import config from "../../../constants/config";
import { checkStatusCode } from "../../../services/checkStatusCode";
import MessageTypes from "@/constants/messageTypes";
import { getURLParameter } from "@/services/getURLParameters";
import Image from "next/image";


const LoginForm = () =>
{
    const [ username, setUsername ] = useState<string>("");
	const [ password, setPassword ] = useState<string>("");

    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const [ isInfo, setIsInfo ] = useState<boolean>(false);
    const [ infoMessage, setInfoMessage ] = useState<string>("");

    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    useEffect(() =>
    {
        // Check for registration.
        const href = window.location.href;

        if (href.includes("registered"))
        {
            setIsInfo(true);
            setInfoMessage(getURLParameter("registered") ?? "Registration successful, you may log in now.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        
        setIsError(false);
        setIsLoading(true);

        const loginRequestBody =
        {
            username: username,
            password: password,
        };

        fetch(config.baseURL + config.login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginRequestBody)
        })
        .then(async (loginResponse) =>
        {
            setIsLoading(false);

            const loginResponseJson = await loginResponse.json();

            if (!checkStatusCode(loginResponse.status))
            {
                setIsError(true);
                setErrorMessage(loginResponseJson.status);
            }
            else
            {
                const token = loginResponseJson.token;

                // Token will expire in 10 days.
                const now = new Date();
                now.setDate(now.getDate() + 10);

                window.localStorage.setItem('token', token);
                window.localStorage.setItem('token_expires', String(now.getTime()));

                if (loginResponseJson.isVerified == true)
                {
                    if (loginResponseJson.paid == true)
                    {
                        window.location.href = "/dashboard";
                    }
                    else
                    {
                        window.location.href = "/createorder";
                    }
                    
                }
                else
                {
                    window.location.href = "/verifyemail";
                }
                
            }

        });

    };
    
    return (
        <>
            <form
                className="form-popout"
                onSubmit={login}
            >
                <div>
                    <span className="form-title">Login</span>
                    <hr className="hr-100"/>
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
                    type="password"
                    label={"Password"}
                    id="password"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.currentTarget.value)}
                />

                <div className="form-buttons">
                    <button type="submit" className="form-primary-button">
                        { isLoading && <>
                            <Image src="/assets/spinner.svg" height={32} width={32} alt="Loading spinner" className="spinner" />
                        </> || <>
                            Login
                        </> }
                    </button>
                    <a href="/register" className="form-secondary-button">Don&apos;t have an account?</a>
                    <a href="/forgotpassword" className="form-subtle-button">Forgot your password?</a>
                </div>
            </form>
        </>
    );
};

export default LoginForm;
