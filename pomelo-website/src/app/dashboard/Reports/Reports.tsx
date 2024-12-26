
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
    const [ isLoading, setIsLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const getReports = () =>
    {
        setIsError(false);
        setIsLoading(true);

        fetch(config.baseURL + config.getReports, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
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

            setIsLoading(false);
        })
        .catch(() =>
        {
            setIsError(true);
            setErrorMessage("Error encountered. Try again later.");
            setIsLoading(false);
        });

    };

    useEffect(() =>
    {
        getReports();
    }, []);

    return (
        <>
            <div className="reports-title-wrapper">
                <div className="reports-title-and-image">
                    <Image src="/assets/sparks.svg" height={24} width={24} alt="Sparkle Icon" />
                    <span className="reports-title">Web History & Coach</span>
                </div>

                <hr className="hr-100" />

                { isError && <>
                    <Message message={errorMessage} type={MessageTypes.Error} />
                </> }

                <div className="reports-wrapper">
                    { (reports.length == 0 && !isLoading && !isError) && <>
                        <Message message={"Download the Pomelo Extension to get started. Find and click your preferred browser's icon in the nav-bar."} type={MessageTypes.Info} />
                    </> }
                    { reports.length > 0 && <>
                        <div className="reports-list">
                            {
                                reports.sort((a, b) => parseInt(a.time_stamp) - parseInt(b.time_stamp)).map((report, idx) =>
                                {
                                    return (
                                        <>
                                            <div className="reports-report-wrapper">
                                                <span className="reports-report-domain" title={report.domain}>{report.domain}</span>
                                                <div className="reports-round-wrapper">
                                                    <div className="reports-title-and-image-wrapper">
                                                        <img
                                                            src={report.faviconurl}
                                                            height={82}
                                                            width={82}
                                                            alt={report.domain + " favicon url"}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="reports-report-date-time-group">
                                                    <span className="reports-report-timestamp">{(new Date(parseInt(report.time_stamp))).toLocaleDateString()}</span>
                                                    <span className="reports-report-timestamp">{(new Date(parseInt(report.time_stamp))).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                            { (idx != reports.length - 1) && <>
                                                <hr
                                                    className="reports-line"
                                                    style={{ width: String(Math.log2(parseInt(reports[idx + 1].time_stamp) - parseInt(report.time_stamp)) + 30) + "px" }}
                                                />
                                            </> }
                                        </>
                                    )
                                })
                            }
                        </div>
                    </> }

                    { isLoading && <>
                        <div className="loading-text">Loading...</div>
                    </> }

                    { reports.length == 0 && !isLoading && !isError && <>
                        <span className="no-reports-found-text">No data found.</span>
                    </> }
                </div>
            </div>
        </>
    );
};

export default Reports;