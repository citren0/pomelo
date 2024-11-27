
"use client";

import { Message, SimpleInput } from "@/components";
import "./PutTimeWastingWebsite.css";
import { useState } from "react";
import MessageTypes from "@/constants/messageTypes";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";


interface Props
{
    getTimeWastingWebsites: () => void;
    getTimeWasted: () => void;
};

const PutTimeWastingWebsite = ({getTimeWastingWebsites, getTimeWasted}: Props) =>
{
    const [ domain, setDomain ] = useState<string>("");
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const putTimeWastingWebsite = () =>
    {
        setIsError(false);

        const putTimeWastingWebsiteURLWithQuery = config.baseURL + config.putTimeWastingWebsites + "?" + (new URLSearchParams(
        [
            ["domain", domain],
        ]));

        fetch(putTimeWastingWebsiteURLWithQuery, {
            method: "PUT",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            }
        })
        .then(async (putTimeWastingWebsiteResponse) =>
        {
            const putTimeWastingWebsiteResponseJson = await putTimeWastingWebsiteResponse.json();

            if (!checkStatusCode(putTimeWastingWebsiteResponse.status))
            {
                setErrorMessage(putTimeWastingWebsiteResponseJson.status);
                setIsError(true);
            }
            else
            {
                getTimeWastingWebsites();
                getTimeWasted();
            }

        })
        .catch(() =>
        {
            setErrorMessage("Error encountered. Try again later.");
            setIsError(true);
        });
    };
    
    return (
        <>
            <div className="put-time-wasting-website-form-wrapper">
                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }
                
                <span className="put-time-wasting-website-form-title">Add a Common Time-Waster</span>
                <SimpleInput label="Domain" type="text" onChange={(e) => setDomain(e.currentTarget.value)} placeholder="example.com" />
                <button className="form-primary-button" onClick={putTimeWastingWebsite}>Add</button>
            </div>
        </>
    );
};

export default PutTimeWastingWebsite;