
"use client";

import { useEffect, useState } from "react";
import "./DeleteAccount.css";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";
import { PaypalSubscriptionStatus } from "@/constants/PaypalSubscriptionStatus";
import { Modal } from "@/components";


const DeleteAccount = () => // CHANGE NAMES OF VARIABLES AND MAKE DELETE ACCOUNT ROUTE / THUNK.
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ openCancelModal, setOpenCancelModal ] = useState<boolean>(false);

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

    return (
        <>
            <div className="subscription-wrapper">
                <button onClick={() => setOpenCancelModal(true)} className="subscription-cancel-button">Delete Account</button>

                <Modal title="Cancel Subscription" triggerOpen={openCancelModal} triggerOpenDone={() => setOpenCancelModal(false)} content={
                    <>
                        <div className="subscription-status-cancel-wrapper">
                            <span className="subscription-status-cancel-text">Are you sure you want to cancel? You can re-subscribe at any point after.</span>
                            <button onClick={cancelSubscription} className="subscription-cancel-button">Yes I'm Sure</button>
                        </div>
                    </>
                }/>
                
            </div>
            
        </>
    );
};

export default DeleteAccount;