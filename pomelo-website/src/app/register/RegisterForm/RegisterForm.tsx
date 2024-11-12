
"use client";

import React, { useState } from "react";
import { InputError, Message, SimpleInput } from "../../../components";
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

    const [ usernameValid, setUsernameValid ] = useState<boolean>(true);
    const [ emailValid, setEmailValid ] = useState<boolean>(true);
    const [ passwordValid, setPasswordValid ] = useState<boolean>(true);

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

        fetch(config.baseURL + config.register, {
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

    const usernameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newValue = e.currentTarget.value;

        const minLength = 4;
        const maxLength = 16;

        if (newValue.length >= minLength && newValue.length <= maxLength)
        {
            setUsernameValid(true);
        }
        else
        {
            setUsernameValid(false);
        }

        setUsername(newValue);
    };

    const emailChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        const newEmail = e.currentTarget.value;

        if (newEmail.includes("@") && newEmail.includes("."))
        {
            setEmailValid(true);
        }
        else
        {
            setEmailValid(false);
        }

        setEmail(newEmail);
    };

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
    
    return (
        <>
            <form
                className="form-popout"
                onSubmit={register}
            >
                <div>
                    <span className="form-title">Register</span>
                    <hr className="hr-100"/>
                    <span className="form-subtext">Create an account to use the Pomelo website and extension.</span>
                </div>

                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }

                <SimpleInput
                    type="text"
                    label={"Username"}
                    id="username"
                    placeholder="JohnDoe"
                    onChange={usernameChanged}
                />

                { !usernameValid && <>
                    <InputError text="Usernames must be between 4 and 16 characters long." />
                </> }

                <SimpleInput
                    type="text"
                    label={"Email"}
                    id="email"
                    placeholder="johndoe@email.com"
                    onChange={emailChanged}
                />

                { !emailValid && <>
                    <InputError text="Provide a valid email." />
                </> }

                <SimpleInput
                    type="password"
                    label={"Password"}
                    id="password"
                    placeholder="••••••••"
                    onChange={passwordChanged}
                />
                
                { !passwordValid && <>
                    <InputError text="Passwords must contain at least 1 uppercase, lowercase, and number and be 8 characters or longer." />
                </> }

                <span className="register-text-small">By registering, you agree to our <a href="/privacy">Privacy Policy</a>, <a href="/cookies">Cookie Policy</a>, and <a href="/terms">Terms of Service</a>.</span>

                <button
                    type="submit"
                    className="form-primary-button"
                    disabled={
                        (!usernameValid ||
                        !emailValid ||
                        !passwordValid ||
                        username.length == 0 ||
                        email.length == 0 ||
                        password.length == 0)
                    }
                >
                    Register
                </button>
                <a href="/login" className="form-secondary-button">Login</a>
            </form>
        </>
    );
};

export default RegisterForm;
