
"use client";

import React, { useState } from "react";
import { Message, SimpleInput } from "../../../components";
import "./RegisterForm.css";
import config from "../../../constants/config";
import { checkStatusCode } from "../../../services/checkStatusCode";
import MessageTypes from "../../../constants/messageTypes";


const RegisterForm = () =>
{
    const [ username, setUsername ] = useState("");
	const [ password, setPassword ] = useState("");
    const [ email, setEmail ] = useState("");

    const [ isError, setIsError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const register = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        
        setIsError(false);

        const registerRequestBody =
        {
            username: username,
            email: email,
            password: password,
        };

        fetch(config.registerURL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerRequestBody)
        })
        .then(async (registerResponse) =>
        {
            const registerResponseJson = await registerResponse.json();

            if (!checkStatusCode(registerResponse.status))
            {
                setIsError(true);
                setErrorMessage(registerResponseJson.status);
            }
            else
            {
                window.location.href = "/login?registered=" + encodeURIComponent(registerResponseJson.status);
            }

        });

    };
    
    return (
        <>
            <form
                className="register-form"
                onSubmit={register}
            >
                <span className="register-form-title">Register</span>
                <hr className="hr-100"/>

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
                <SimpleInput
                    type="text"
                    label={"Email"}
                    id="email"
                    placeholder="johndoe@email.com"
                    onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <SimpleInput
                    type="password"
                    label={"Password"}
                    id="password"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <button type="submit">Register</button>
                <a href="/login">Login</a>
            </form>
        </>
    );
};

export default RegisterForm;
