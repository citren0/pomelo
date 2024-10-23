
"use client";

import React, { useEffect, useState } from "react";
import "./Reports.css";
import config from "../../../constants/config";
import { checkStatusCode } from "../../../services/checkStatusCode";
import { Message } from "../../../components";
import MessageTypes from "../../../constants/messageTypes";
import Report from "@/interfaces/Report";
import Image from "next/image";


const Reports = () =>
{
    const [ reports, setReports ] = useState<Report[]>([]);
    const [ isError, setIsError ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const getReports = () =>
    {        
        setIsError(false);

        fetch(config.getReportsURL, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token") ?? "",
            },
        })
        .then(async (getReportsResponse) =>
        {
            const getReportsResponseJson = await getReportsResponse.json();

            if (!checkStatusCode(getReportsResponse.status))
            {
                setIsError(true);
                setErrorMessage(getReportsResponseJson.status);
            }
            else
            {
                if (!getReportsResponseJson.hasOwnProperty("reports"))
                {
                    setIsError(true);
                    setErrorMessage("Unauthorized, please log in.");
                }
                else
                {
                    setReports(getReportsResponseJson.reports);
                }
                
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
        getReports();
    }, []);

    return (
        <>
            <div className="reports-title-wrapper">
                <span className="reports-title">Last 24 Hours</span>
                <hr className="hr-100" />

                { isError && <>
                    <Message message={errorMessage} type={MessageTypes.Error} />
                </> }

                <div className="reports-wrapper">
                    {
                        reports.map((report, idx) =>
                        {
                            return (
                                <>
                                    <div className="reports-report-wrapper">
                                        <div className="reports-title-and-image-wrapper">
                                            <img
                                                src={report.faviconurl}
                                                height={40}
                                                width={40}
                                                alt={report.domain + " favicon url"}
                                            />
                                            <span className="reports-report-domain report-rotate">{report.domain}</span>
                                        </div>
                                        <span className="reports-report-timestamp report-rotate">{(new Date(parseInt(report.time_stamp))).toLocaleDateString()}</span>
                                        <span className="reports-report-timestamp report-rotate">{(new Date(parseInt(report.time_stamp))).toLocaleTimeString()}</span>
                                    </div>
                                    { (idx != reports.length - 1) && <>
                                        <hr
                                            className="reports-line"
                                            style={{ width: String(Math.log2(parseInt(reports[idx + 1].time_stamp) - parseInt(report.time_stamp))) + "px" }}
                                        />
                                    </> }
                                </>
                            )
                        })
                    }
                </div>
            </div>
        </>
    );
};

export default Reports;