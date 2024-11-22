
"use client";

import React, { useEffect, useRef, useState } from "react";
import "./page.css";
import { Message, NavBar, Cookies } from "../../components";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import config from "@/constants/config";
import MessageTypes from "@/constants/messageTypes";
import { checkStatusCode } from "@/services/checkStatusCode";


const CreateOrder = () =>
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ userId, setUserId ] = useState<number>(-1);
    const [ hasCurrentSubscription, setHasCurrentSubscription ] = useState<boolean>(false);
    const userIdRef = useRef<number>(-1);

    const options =
    {
        clientId: config.paypalClientId,
        currency: "USD",
        vault: true,
    };

    const onError = (error: Record<string, unknown>) =>
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
                    setHasCurrentSubscription(userInfoResponseJson.user.activeSubscription);
                    userIdRef.current = userInfoResponseJson.user.id;
                }
                
            }

        });

    };

    const onApprove = (): Promise<void> =>
    {
        return new Promise<void>((resolve) =>
        {
            window.location.href = "/ordersuccess";
            resolve();
        });

    };

    useEffect(() =>
    {
        getUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

	return (
		<>
			<NavBar />
			
			<div className="content-container">
                <div className="create-order-wrapper">
                    <div className="create-order-card">
                        <div>
                            <span className="create-order-card-title">Your Pomelo Subscription</span>
                            <hr className="hr-100" />
                            { isError && <>
                                <Message message={errorMessage} type={MessageTypes.Error} />
                            </> }
                            { hasCurrentSubscription && <>
                                <Message message="You already have an active subscription" type={MessageTypes.Warning} />
                            </> }
                        </div>

                        <span className="create-order-card-text">A subscription to Pomelo costs $10 / month. This will grant you access to the entire website and all functionality. By subscribing, you agree to the terms of service and privacy policy below.</span>

                        <div className="create-order-links">
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/terms">Terms of Service</a>
                        </div>
                        

                        <div className="create-order-pay-group">
                            <span className="create-order-card-text-secondary">Use PayPal to pay:</span>

                            <PayPalScriptProvider options={options} >
                                <PayPalButtons
                                    style={{ layout: "vertical", disableMaxWidth: true, }}
                                    disabled={(userId == -1) || hasCurrentSubscription}
                                    onApprove={onApprove}
                                    onError={onError}
                                    createSubscription={(data, actions) => {
                                        return actions.subscription.create({
                                            plan_id: 'P-8XA030171E179871EM4UUM3Y',
                                            custom_id: String(userIdRef.current),
                                        });
                                    }}
                                />
                            </PayPalScriptProvider>
                        </div>
                    </div>
                </div>
                <a className="need-help-text" href="/contactus">
                    Need help?
                </a>
			</div>

            <Cookies />
		</>
	);
};

export default CreateOrder;