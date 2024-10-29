
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import "./Insights.css";
import { checkStatusCode } from "@/services/checkStatusCode";
import config from "@/constants/config";
import { Message, SimpleTextArea } from "@/components";
import Image from "next/image";
import MessageTypes from "@/constants/messageTypes";

interface Message
{
    me: boolean;
    message: string;
};

const Insights = () =>
{
    const [ messages, setMessages ] = useState<Message[]>([]);
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ currMessage, setCurrMessage ] = useState<string>("");
    const [ doSend, setDoSend ] = useState<boolean>(false);
    const [ clearChat, setClearChat ] = useState<boolean>(false);

    const getInsights = () =>
    {
        setIsLoading(true);

        fetch(config.getInsightsURL, {
            method: "POST",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token") ?? "",
            },
            body: "",
        })
        .then(async (getInsightsResponse) =>
        {
            const getInsightsResponseJson = await getInsightsResponse.json();

            if (!checkStatusCode(getInsightsResponse.status))
            {
                setIsError(true);
                setErrorMessage(getInsightsResponseJson.status);
            }
            else
            {
                if (!getInsightsResponseJson.hasOwnProperty("insights"))
                {
                    setIsError(true);
                    setErrorMessage("Unauthorized, please log in.");
                }
                else
                {
                    const newMessages = messages;
                    newMessages.push({ me: false, message: getInsightsResponseJson.insights.replace("*", "\n*"), })
                    setMessages(newMessages);

                    setTimeout(() =>
                    {
                        const contentWrapper = document.getElementById("insights-content-wrapper");
                        contentWrapper?.scrollTo(0, contentWrapper?.scrollHeight);
                    }, 50);
                }
                
            }

            setIsLoading(false);
        })
        .catch((_) =>
        {
            setIsError(true);
            setErrorMessage("Error encountered. Try again later.");
            setIsLoading(false);
        });

    };

    const sendMessage = () =>
    {
        if (currMessage.trim().length == 0)
        {
            return;
        }

        const newMessages = messages;
        newMessages.push({ me: true, message: currMessage.trim(), });
        setMessages(newMessages);
        setClearChat(!clearChat);
        setCurrMessage("");

        getInsights();

        setTimeout(() =>
        {
            const contentWrapper = document.getElementById("insights-content-wrapper");
            contentWrapper?.scrollTo(0, contentWrapper?.scrollHeight);
        }, 50);

    };

    useEffect(() =>
    {
        getInsights();
    }, []);

    useEffect(() =>
    {
        if (doSend == true)
        {
            sendMessage();
            setDoSend(false);
        }
    }, [doSend]);
    
    return (
        <>
            <div className="insights-wrapper">
                <div className="insights-title-and-image">
                    <span className="insights-title">Insights</span>
                    <Image src="/assets/sparks.svg" height={24} width={24} alt="Sparkle Icon" />
                </div>
                <hr className="hr-100" />

                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }
                
                <div className="insights-content-wrapper" id="insights-content-wrapper">
                    { messages.map((message) =>
                        {
                            if (message.me == true)
                            {
                                return (
                                    <>
                                        <div className="insights-me-wrapper">
                                            <span className="insights-text">{message.message}</span>
                                        </div>
                                    </>
                                );
                            }
                            else
                            {
                                return (
                                    <>
                                        <div className="insights-bot-wrapper">
                                            <span className="insights-text">{message.message}</span>
                                        </div>
                                    </>
                                );
                            }
                        }
                    )}
                    
                    { isLoading && <>
                        <div className="insights-loading-wrapper">Loading...</div>
                    </> }
                </div>

                <form
                    className="insights-chat-wrapper"
                    onSubmit={
                            (e: React.FormEvent<HTMLFormElement>) => 
                            {
                                e.preventDefault();
                                setDoSend(true);
                            }
                        }
                >
                    <SimpleTextArea
                        label=""
                        id=""
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { setCurrMessage(e.currentTarget.value); }}
                        placeholder=""
                        clear={clearChat}
                    />

                    <button
                        className="insights-chat-send-button"
                        type="submit"
                        disabled={(isLoading || isError)}
                    >
                        { (isLoading || isError) && <>
                            <Image
                                src={"/assets/no-send.svg"}
                                alt="Disabled send button image"
                                height={30}
                                width={30}
                            />
                        </> || <>
                            <Image
                                src={"/assets/send.svg"}
                                alt="Send button image"
                                height={30}
                                width={30}
                            />
                        </> }
                    </button>
                </form>
            </div>
        </>
    );
};

export default Insights;