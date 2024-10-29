
"use client";

import { Message, SimpleTextArea } from "@/components";
import "./Strategy.css";
import { useState } from "react";
import MessageTypes from "@/constants/messageTypes";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";


const Strategy = () =>
{
    const [ strategy, setStrategy ] = useState<string>("");

    const [ isError, setIsError ] = useState<boolean>();
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const updateStrategy = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setStrategy(e.currentTarget.value);

        fetch(config.updateStrategyURL, {
            method: "POST",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token") ?? "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ strategy: strategy })
        })
        .then(async (updateStrategyResponse) =>
        {
            const updateStrategyResponseJson = await updateStrategyResponse.json();

            if (!checkStatusCode(updateStrategyResponse.status))
            {
                setIsError(true);
                setErrorMessage(updateStrategyResponseJson.status);
            }
            else
            {
                setIsError(false);
            }

        })
        .catch((_) =>
        {
            setIsError(true);
            setErrorMessage("Error encountered. Try again later.");
        });

    };

    return (
        <>
            <div className="strategy-title-wrapper">
                <span className="strategy-title">Your Productivity Strategy</span>
                <hr className="hr-100" />

                { isError && <>
                    <Message message={errorMessage} type={MessageTypes.Error} />
                </> }
                
                <SimpleTextArea
                    label=""
                    onChange={updateStrategy}
                    placeholder="Begin typing to create a productivity plan."
                    id="strategy-text-area"
                    rows={10}
                    cols={75}
                />
            </div>
        </>
    );
};

export default Strategy;