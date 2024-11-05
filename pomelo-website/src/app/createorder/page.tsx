
"use client";

import React, { useState } from "react";
import "./page.css";
import { Message, NavBar } from "../../components";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import config from "@/constants/config";
import { captureOrder, createOrder } from "@/services/paypal";
import MessageTypes from "@/constants/messageTypes";


const CreateOrder = () =>
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const options =
    {
        clientId: config.paypalClientId,
        currency: "USD",
        intent: "capture",
        vault: true,
    };

    const onError = (error: any) =>
    {
        setIsError(true);
        setErrorMessage(String(error));
    };

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
                        onApprove={captureOrder}
                        onError={onError}
                        createSubscription={(data: any, actions: any) => {
                            return actions.subscription.create({
                                plan_id: 'P-8XA030171E179871EM4UUM3Y'
                            });
                        }}
                    />
                </PayPalScriptProvider>
			</div>
		</>
	);
};

export default CreateOrder;