
"use client";

import { useEffect, useState } from "react";
import "./Subscription.css";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";
import { PaypalSubscriptionStatus } from "@/constants/PaypalSubscriptionStatus";


const Subscription = () =>
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ subscriptionStatus, setSubscriptionStatus ] = useState<PaypalSubscriptionStatus>(PaypalSubscriptionStatus.NotLoaded);
    
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
                setSubscriptionStatus(subscriptionDetailsResponseJson.subscriptionStatus);
            }

        });

    };

    useEffect(() =>
    {
        getSubscriptionStatus();
    }, []);

    return (
        <>
            <span className="subscription-status-left">Your subscription status is: </span>

            { subscriptionStatus == PaypalSubscriptionStatus.NotLoaded && <>
                <span className="subscription-status-right">Loading</span>
            </> }
            { subscriptionStatus == PaypalSubscriptionStatus.Active && <>
                <span className="subscription-status-right">Active</span>
            </> }
            { subscriptionStatus == PaypalSubscriptionStatus.ApprovalPending && <>
                <span className="subscription-status-right">Pending</span>
            </> }
            { subscriptionStatus == PaypalSubscriptionStatus.Approved && <>
                <span className="subscription-status-right">Approved</span>
            </> }
            { subscriptionStatus == PaypalSubscriptionStatus.Cancelled && <>
                <span className="subscription-status-right">Cancelled</span>
            </> }
            { subscriptionStatus == PaypalSubscriptionStatus.Expired && <>
                <span className="subscription-status-right">Expired</span>
            </> }
            { subscriptionStatus == PaypalSubscriptionStatus.Suspended && <>
                <span className="subscription-status-right">Suspended</span>
            </> }
            
        </>
    );
};

export default Subscription;