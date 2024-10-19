
"use client";

import React, { useEffect, useState } from "react";
import "./UserInfo.css";
import config from "../../../constants/config";
import { checkStatusCode } from "../../../services/checkStatusCode";
import { Message } from "../../../components";
import MessageTypes from "../../../constants/messageTypes";


const UserInfo = () =>
{
    const [ username, setUsername ] = useState("Loading...");
    const [ email, setEmail ] = useState("Loading...");
    const [ registered, setRegistered ] = useState("Loading...");

    const [ isError, setIsError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const getUserInfo = () =>
    {        
        setIsError(false);

        fetch(config.userInfoURL, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token") ?? "",
            },
        })
        .then(async (userInfoResponse) =>
        {
            const userInfoResponseJson = await userInfoResponse.json();

            if (!checkStatusCode(userInfoResponse.status))
            {
                setIsError(true);
                setErrorMessage(userInfoResponseJson.status);
            }
            else
            {
                if (!userInfoResponseJson.hasOwnProperty("user"))
                {
                    setIsError(true);
                    setErrorMessage("Are you sure you're logged in?");
                }
                else
                {
                    setUsername(userInfoResponseJson.user.username);
                    setEmail(userInfoResponseJson.user.email);
                    setRegistered(userInfoResponseJson.user.registration);
                }
                
            }

        });

    };

    useEffect(() =>
    {
        getUserInfo();
    }, []);

    return (
        <>
            <div className="user-info-wrapper">
                <span className="user-info-title">User Details</span>
                <hr className="hr-100" />

                { isError && <>
                    <Message message={errorMessage} type={MessageTypes.Error} />
                </> }

                <span className="user-info-username">{username}</span>
                <span className="user-info-email">{email}</span>
                <span className="user-info-registration">{(new Date(parseInt(registered))).toLocaleString()}</span>
            </div>
        </>
    );
};

export default UserInfo;