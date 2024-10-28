
"use client";

import { Message, SimpleInput } from "../../../components";
import "./LoginForm.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import MessageTypes from "../../../constants/messageTypes";
import { login } from "../../../store/login-slice/thunks";
import loginSelectors from "../../../store/login-slice/selectors";
import AsyncThunkStatus from "../../../enums/AsyncThunkStatus";
import { setPassword, setUsername } from "../../../store/login-slice/slice";


const LoginForm = () =>
{
    const dispatch = useDispatch<AppDispatch>();

    const loginThunkStatus = useSelector(loginSelectors.selectLoginThunkStatus);

    const loginSubmit = (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();

        dispatch(login());
    };
    
    return (
        <>
            <form
                className="login-form"
                onSubmit={loginSubmit}
            >
                <div>
                    <span className="login-form-title">Login or Register</span>
                    <hr className="hr-100"/>
                    <span className="form-subtext">Before you can use the Pomelo extension, sign in with your account credentials or register.</span>
                </div>

                { loginThunkStatus.thunkStatus == AsyncThunkStatus.Error && <>
                    <Message type={MessageTypes.Error} message={loginThunkStatus.message ?? "Login failed."} />
                </> }

                <SimpleInput
                    type="text"
                    label={"Username"}
                    id="username"
                    placeholder="JohnDoe"
                    onChange={(e) => dispatch(setUsername(e.currentTarget.value))}
                />
                <SimpleInput
                    type="password"
                    label={"Password"}
                    id="password"
                    placeholder="••••••••"
                    onChange={(e) => dispatch(setPassword(e.currentTarget.value))}
                />

                <button type="submit" className="form-primary-button">Login</button>
                <a href="https://pomeloprod.com/register" target="_blank" className="form-secondary-button">Register</a>
            </form>
        </>
    );
};

export default LoginForm;
