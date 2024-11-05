
"use client";

import React, { useEffect, useRef, useState } from "react";
import "./page.css";
import { Message, NavBar } from "../../components";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import config from "@/constants/config";
import MessageTypes from "@/constants/messageTypes";
import { checkStatusCode } from "@/services/checkStatusCode";


const CreateOrder = () =>
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ userId, setUserId ] = useState<number>(-1);
    const userIdRef = useRef<number>(-1);

    const options =
    {
        clientId: config.paypalClientId,
        currency: "USD",
        vault: true,
    };

    const onError = (error: any) =>
    {
        setIsError(true);
        setErrorMessage(String(error));
    };

    const getUserInfo = () =>
    {
        setIsError(false);

        fetch(config.baseURL + config.userInfo, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
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
                    setUserId(userInfoResponseJson.user.id);
                    userIdRef.current = userInfoResponseJson.user.id;
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
			<NavBar />
			
			<div className="content-container">
                { isError && <>
                    <Message message={errorMessage} type={MessageTypes.Error} />
                </> }

                <PayPalScriptProvider options={options} >
                    <PayPalButtons
                        style={{ layout: "vertical", disableMaxWidth: true, }}
                        disabled={(userId == -1)}
                        onError={onError}
                        createSubscription={(data: any, actions: any) => {
                            return actions.subscription.create({
                                plan_id: 'P-8XA030171E179871EM4UUM3Y',
                                custom_id: userIdRef.current,
                            });
                        }}
                    />
                </PayPalScriptProvider>
			</div>
		</>
	);
};

export default CreateOrder;