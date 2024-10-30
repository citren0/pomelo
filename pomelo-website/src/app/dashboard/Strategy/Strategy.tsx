
"use client";

import { Message, SimpleTextArea } from "@/components";
import "./Strategy.css";
import { useEffect, useState } from "react";
import MessageTypes from "@/constants/messageTypes";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";


interface Props
{
    doNewStrategy: boolean;
    newStrategy: string;
    resetDoNewStrategy: () => void;
};

const Strategy = ({doNewStrategy, newStrategy, resetDoNewStrategy}: Props) =>
{
    const [ strategy, setStrategy ] = useState<string>("");

    const [ isError, setIsError ] = useState<boolean>();
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const updateStrategy = (e?: React.ChangeEvent<HTMLTextAreaElement>, newStrategy?: string) =>
    {
        setStrategy(e?.currentTarget?.value ?? newStrategy ?? "");

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

    const getStrategy = () =>
    {
        fetch(config.getStrategyURL, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token") ?? "",
            }
        })
        .then(async (getStrategyResponse) =>
        {
            const getStrategyResponseJson = await getStrategyResponse.json();

            if (!checkStatusCode(getStrategyResponse.status))
            {
                setIsError(true);
                setErrorMessage(getStrategyResponseJson.status);
            }
            else
            {
                setIsError(false);
                setStrategy(getStrategyResponseJson.strategy);
            }

        })
        .catch((_) =>
        {
            setIsError(true);
            setErrorMessage("Error encountered. Try again later.");
        });

    };

    useEffect(() =>
    {
        getStrategy();
    }, []);

    useEffect(() =>
    {
        if (doNewStrategy)
        {
            updateStrategy(undefined, newStrategy);
            resetDoNewStrategy();
        }
    }, [doNewStrategy, newStrategy]);

    return (
        <>
            <div className="strategy-title-wrapper">
                <span className="strategy-title">My Productivity Strategy</span>
                <hr className="hr-100" />

                { isError && <>
                    <Message message={errorMessage} type={MessageTypes.Error} />
                </> }
                
                <SimpleTextArea
                    label=""
                    onChange={updateStrategy}
                    placeholder="Begin typing to create a productivity plan."
                    id="strategy-text-area"
                    rows={5}
                    cols={75}
                    presetValue={strategy}
                    resizeable={true}
                />
            </div>
        </>
    );
};

export default Strategy;