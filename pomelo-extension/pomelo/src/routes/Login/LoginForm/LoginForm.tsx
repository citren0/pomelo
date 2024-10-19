
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
                <span className="login-form-title">Login</span>
                <hr className="hr-100"/>

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
                <button type="submit">Login</button>
                <span>Register on the Pomelo website.</span>
            </form>
        </>
    );
};

export default LoginForm;
