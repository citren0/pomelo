
"use client";

import { useEffect, useState } from "react";
import "./Subscription.css";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";
import { PaypalSubscriptionStatus } from "@/constants/PaypalSubscriptionStatus";
import { Message, Modal } from "@/components";
import MessageTypes from "@/constants/messageTypes";


const Subscription = () =>
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ subscriptionStatus, setSubscriptionStatus ] = useState<PaypalSubscriptionStatus>(PaypalSubscriptionStatus.NotLoaded);
    const [ openCancelModal, setOpenCancelModal ] = useState<boolean>(false);
    
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

    const cancelSubscription = () =>
    {
        setIsError(false);

        fetch(config.baseURL + config.cancelSubscription, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            },
        })
        .then(async (cancelSubscriptionResponse) =>
        {
            const cancelSubscriptionResponseJson = await cancelSubscriptionResponse.json();

            if (!checkStatusCode(cancelSubscriptionResponse.status))
            {
                setIsError(true);
                setErrorMessage(cancelSubscriptionResponseJson.status);
            }
            else
            {
                window.location.href = "/logout";
            }

        });

    };

    useEffect(() =>
    {
        getSubscriptionStatus();
    }, []);

    return (
        <>
            <div className="subscription-wrapper">

                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }

                <div className="subscription-status-wrapper">
                    <span className="subscription-status-left">Your subscription status is: </span>
                    { subscriptionStatus == PaypalSubscriptionStatus.NotLoaded && <>
                        <span className="subscription-status-right" style={{ color: "#4a4a4a" }}>Loading</span>
                    </> }
                    { subscriptionStatus == PaypalSubscriptionStatus.Active && <>
                        <span className="subscription-status-right" style={{ color: "#30b862" }}>Active</span>
                    </> }
                    { subscriptionStatus == PaypalSubscriptionStatus.ApprovalPending && <>
                        <span className="subscription-status-right" style={{ color: "#c97104" }}>Pending</span>
                    </> }
                    { subscriptionStatus == PaypalSubscriptionStatus.Approved && <>
                        <span className="subscription-status-right" style={{ color: "#30b862" }}>Approved</span>
                    </> }
                    { subscriptionStatus == PaypalSubscriptionStatus.Cancelled && <>
                        <span className="subscription-status-right" style={{ color: "#a3020a" }}>Cancelled</span>
                    </> }
                    { subscriptionStatus == PaypalSubscriptionStatus.Expired && <>
                        <span className="subscription-status-right" style={{ color: "#a3020a" }}>Expired</span>
                    </> }
                    { subscriptionStatus == PaypalSubscriptionStatus.Suspended && <>
                        <span className="subscription-status-right" style={{ color: "#a3020a" }}>Suspended</span>
                    </> }
                </div>

                { [ PaypalSubscriptionStatus.Active, PaypalSubscriptionStatus.ApprovalPending, PaypalSubscriptionStatus.Approved ].includes(subscriptionStatus) && <>
                    <button onClick={() => setOpenCancelModal(true)} className="subscription-cancel-button">Cancel Subscription</button>
                </> }

                <Modal title="Cancel Subscription" triggerOpen={openCancelModal} triggerOpenDone={() => setOpenCancelModal(false)} content={
                    <>
                        <div className="subscription-status-cancel-wrapper">
                            <span className="subscription-status-cancel-text">Are you sure you want to cancel? You will be logged out. You can re-subscribe at any point after.</span>
                            <button onClick={cancelSubscription} className="subscription-cancel-button">Yes I&apos;m Sure</button>
                        </div>
                    </>
                }/>
                
            </div>
            
        </>
    );
};

export default Subscription;