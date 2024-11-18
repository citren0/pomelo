
"use client";
import { Message } from "@/components";
import MessageTypes from "@/constants/messageTypes";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./SubscriptionStatus.css";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";
import { PaypalSubscriptionStatus } from "@/constants/PaypalSubscriptionStatus";
import getNewToken from "@/services/getNewToken";


const SubscriptionStatus = () =>
{
    const [ isActive, setIsActive ] = useState<boolean>(false);
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
	const [ intervalId, setIntervalId ] = useState<number>();

    const getSubscriptionStatus = () =>
    {        
        setIsError(false);

        fetch(config.baseURL + config.subscriptionDetails, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            },
        })
        .then(async (subscriptionDetailsResponse) =>
        {
            const subscriptionDetailsResponseJson = await subscriptionDetailsResponse.json();

            if (!checkStatusCode(subscriptionDetailsResponse.status))
            {
                setIsError(true);
                setErrorMessage(subscriptionDetailsResponseJson.status);
            }
            else
            {
                if (subscriptionDetailsResponseJson.subscriptionStatus == PaypalSubscriptionStatus.Active)
                {
                    window.clearInterval(intervalId);

                    getNewToken()
                    .then(() =>
                    {
                        setIsActive(true);
                    })
                    .catch(() =>
                    {
                        setIsError(true);
                        setErrorMessage("Failed to issue token. Log out and then log back in to fix this problem.");
                    });
                    
                }

            }

        });

    };

    useEffect(() =>
    {
        setIntervalId(window.setInterval(getSubscriptionStatus, 2000));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
            <div className="order-success-status-wrapper">
                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }

                <div className="text-with-image">
                    <span className="order-success-status">Your subscription status is: </span>
                    { !isActive && <>
                        <Image src="/assets/spinner.svg" className="spinner" height={48} width={48} alt="Loading spinner" />
                        <span className="order-success-pending">Pending</span>
                    </> || <>
                        <span className="order-success-active">Active</span>
                    </> }
                </div>
                <span className="order-success-status-small">Wait on this page until your subscription status becomes &quot;Active&quot;. If it takes longer than a couple minutes, log out and back in.</span>
            </div>
        </>
    )
};

export default SubscriptionStatus;