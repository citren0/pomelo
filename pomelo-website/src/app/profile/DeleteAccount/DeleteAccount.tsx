
"use client";

import { useEffect, useState } from "react";
import "./DeleteAccount.css";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";
import { Message, Modal } from "@/components";
import MessageTypes from "@/constants/messageTypes";


const DeleteAccount = () =>
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ openDeleteModal, setOpenDeleteModal ] = useState<boolean>(false);

    const deleteAccount = () =>
    {
        setIsError(false);

        fetch(config.baseURL + config.deleteAccount, {
            method: "DELETE",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            },
        })
        .then(async (deleteAccountResponse) =>
        {
            const deleteAccountResponseJson = await deleteAccountResponse.json();

            if (!checkStatusCode(deleteAccountResponse.status))
            {
                setIsError(true);
                setErrorMessage(deleteAccountResponseJson.status);
            }
            else
            {
                window.location.href = "/logout";
            }

        });

    };

    return (
        <>
            <div className="delete-account-wrapper">

                <button onClick={() => setOpenDeleteModal(true)} className="delete-account-button">Delete Account</button>

                <Modal title="Delete Account" triggerOpen={openDeleteModal} triggerOpenDone={() => setOpenDeleteModal(false)} content={
                    <>
                        { isError && <>
                            <Message type={MessageTypes.Error} message={errorMessage} />
                        </> }

                        <div className="delete-account-cancel-wrapper">
                            <span className="delete-account-cancel-text">Are you sure you want to permanently delete your account? You will be logged out.</span>
                            <button onClick={deleteAccount} className="delete-account-button">Yes I'm Sure</button>
                        </div>
                    </>
                }/>
                
            </div>
            
        </>
    );
};

export default DeleteAccount;