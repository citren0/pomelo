
"use client";

import { useEffect, useState } from "react";
import "./Insights.css";
import { checkStatusCode } from "@/services/checkStatusCode";
import config from "@/constants/config";
import { Message } from "@/components";
import MessageTypes from "@/constants/messageTypes";


const Insights = () =>
{
    const [ insights, setInsights ] = useState<string>("Loading...");
    const [ isError, setIsError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const getReports = () =>
    {        
        setIsError(false);

        fetch(config.getInsightsURL, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token") ?? "",
            },
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
                    setInsights(getInsightsResponseJson.insights);
                }
                
            }

        });

    };

    useEffect(() =>
    {
        getReports();
    }, []);
    
    return (
        <>
            <div className="insights-wrapper">
                <span className="insights-title">Insights</span>
                <hr className="hr-100" />

                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }
                
                <div className="insights-content-wrapper">
                    {insights}
                </div>
            </div>
        </>
    );
};

export default Insights;