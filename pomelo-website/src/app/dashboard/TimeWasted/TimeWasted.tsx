
"use client";

import { ChangeEvent, useEffect, useState } from "react";
import "./TimeWasted.css";
import config from "@/constants/config";
import Image from "next/image";
import { Message } from "@/components";
import MessageTypes from "@/constants/messageTypes";
import { TimeWastedDay } from "@/interfaces/TimeWastedDay";
import { DayMonthYear } from "@/interfaces/DayMonthYear";
import { checkStatusCode } from "@/services/checkStatusCode";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import PutTimeWastingWebsite from "./PutTimeWastingWebsite/PutTimeWastingWebsite";


export interface TimeWasted
{
    time_stamp: number;
    total_time_spent: number;
    time_wasted: number;
};

const TimeWasted = () =>
{
    const now = (new Date());
    const weekAgo = (new Date());
    weekAgo.setDate((new Date()).getDate() - 7);

    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const [ timeWastedDays, setTimeWastedDays ] = useState<TimeWastedDay[]>([]);
    const [ timeWastingWebsites, setTimeWastingWebsites ] = useState<string[]>([]);
    const [ startTime, setStartTime ] = useState<DayMonthYear>({ day: weekAgo.getDate(), month: weekAgo.getMonth(), year: weekAgo.getFullYear(), });
    const [ stopTime, setStopTime ] = useState<DayMonthYear>({ day: now.getDate(), month: now.getMonth(), year: now.getFullYear(), });

    
    const changeStart = (time: number) =>
    {
        const date = new Date(time);

        const newDayMonthYear: DayMonthYear = {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
        };

        setStartTime(newDayMonthYear);
    };

    
    const changeStop = (time: number) =>
    {
        const date = new Date(time);

        const newDayMonthYear: DayMonthYear = {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear(),
        };

        setStopTime(newDayMonthYear);
    };

    
    const getTimeWasted = () =>
    {
        setIsError(false);

        const getTimeWastedURLWithQuery = config.baseURL + config.getTimeWasted + "?" + (new URLSearchParams(
        [
            ["start_day", String(startTime.day)],
            ["start_month", String(startTime.month)],
            ["start_year", String(startTime.year)],
            ["stop_day", String(stopTime.day)],
            ["stop_month", String(stopTime.month)],
            ["stop_year", String(stopTime.year)],
        ]));

        fetch(getTimeWastedURLWithQuery, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            }
        })
        .then(async (getTimeWastedResponse) =>
        {
            const getTimeWastedResponseJson = await getTimeWastedResponse.json();

            if (!checkStatusCode(getTimeWastedResponse.status))
            {
                setErrorMessage(getTimeWastedResponseJson.status);
                setIsError(true);
            }
            else
            {
                getTimeWastedResponseJson.days.sort((a: TimeWasted, b: TimeWasted) => a.time_stamp - b.time_stamp);

                const mappedDays = getTimeWastedResponseJson.days.map((day: TimeWasted): TimeWastedDay =>
                {
                    return {
                        total_time_spent: day.total_time_spent,
                        time_wasted: day.time_wasted,
                        timeString: `${(new Date(day.time_stamp)).getFullYear()}-${(new Date(day.time_stamp)).getMonth()}-${(new Date(day.time_stamp)).getDate()}`
                    };
                });

                setTimeWastedDays(mappedDays);
            }

        })
        .catch(() =>
        {
            setErrorMessage("Error encountered. Try again later.");
            setIsError(true);
        });

    };


    const getTimeWastingWebsites = () =>
    {
        setIsError(false);

        fetch(config.baseURL + config.getTimeWastingWebsites, {
            method: "GET",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            }
        })
        .then(async (getTimeWastingWebsitesResponse) =>
        {
            const getTimeWastingWebsitesResponseJson = await getTimeWastingWebsitesResponse.json();

            if (!checkStatusCode(getTimeWastingWebsitesResponse.status))
            {
                setErrorMessage(getTimeWastingWebsitesResponseJson.status);
                setIsError(true);
            }
            else
            {
                setTimeWastingWebsites(getTimeWastingWebsitesResponseJson.websites);
            }

        })
        .catch(() =>
        {
            setErrorMessage("Error encountered. Try again later.");
            setIsError(true);
        });

    };


    const deleteTimeWastingWebsites = (domain: string) =>
    {
        setIsError(false);

        const deleteTimeWastingWebsitesURLWithQuery = config.baseURL + config.deleteTimeWastingWebsites + "?" + (new URLSearchParams(
        [
            ["domain", domain],
        ]));

        fetch(deleteTimeWastingWebsitesURLWithQuery, {
            method: "DELETE",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            }
        })
        .then(async (deleteTimeWastingWebsitesResponse) =>
        {
            const deleteTimeWastingWebsitesResponseJson = await deleteTimeWastingWebsitesResponse.json();

            if (!checkStatusCode(deleteTimeWastingWebsitesResponse.status))
            {
                setErrorMessage(deleteTimeWastingWebsitesResponseJson.status);
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


    useEffect(() =>
    {
        getTimeWasted();
        getTimeWastingWebsites();
    }, [startTime, stopTime]);


    return (
        <>
            <div className="time-wasted-row">
                <div className="time-wasted-wrapper">
                    <span className="time-wasted-title">Your Productivity Journey</span>
                    <hr className="hr-100" />
                    { isError && <>
                        <Message type={MessageTypes.Error} message={errorMessage} />
                    </> }

                    <div className="time-wasted-input-row">
                        <input
                            type="date"
                            defaultValue={`${weekAgo.getFullYear()}-${weekAgo.getMonth() + 1}-${weekAgo.getDate()}`}
                            className="time-wasted-input-calendar"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => changeStart(e.currentTarget.valueAsNumber)}
                        />
                        <span className="time-wasted-input-label">-</span>
                        <input
                            type="date"
                            defaultValue={`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`}
                            className="time-wasted-input-calendar"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => changeStop(e.currentTarget.valueAsNumber)}
                        />
                    </div>


                    <LineChart
                        width={600}
                        height={500}
                        data={timeWastedDays}
                        margin={{ top: 50, right: 20, left: 10, bottom: 5 }}
                        style={{ maxWidth: "100%", height: "fit-content" }}
                    >
                        <YAxis yAxisId={0} />
                        <XAxis dataKey="timeString" />
                        <Tooltip />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Line type="monotone" dataKey="time_wasted" stroke="#ff7300" yAxisId={0} />
                        <Line type="monotone" dataKey="total_time_spent" stroke="#387908" yAxisId={0} />
                    </LineChart>
                    <span className="time-wasted-plot-title">{"Your Online Time Usage (Minutes) Each Day"}</span>
                </div>

                <div className="time-wasted-wrapper">
                    <span className="time-wasted-title">Your Common Time-Wasters</span>
                    <hr className="hr-100" />
                    { isError && <>
                        <Message type={MessageTypes.Error} message={errorMessage} />
                    </> }
                    
                    <div className="time-wasted-content">
                        <div className="time-wasted-container">
                            { timeWastingWebsites.map((website, idx) =>
                                {
                                    return (
                                        <div key={website}>
                                            <div className="time-waste-website-wrapper">
                                                <span className="time-waste-website-number">{idx + 1}</span>
                                                <span className="time-waste-website-domain">{ website }</span>
                                                <button className="btn-image" onClick={() => deleteTimeWastingWebsites(website)}>
                                                    <Image src={"/assets/trash.svg"} height={24} width={24} alt={"Trash can icon"} />
                                                </button>
                                            </div>
                                            <hr className="hr-100" />
                                        </div>
                                    );
                                })
                            }

                            { timeWastingWebsites.length == 0 && !isError && <>
                                <span className="time-wasted-non-found-text">Any websites added here will be counted as &quot;Wasted Time&quot; in the automatic time-tracker.</span>
                            </> }
                        </div>

                        <PutTimeWastingWebsite getTimeWastingWebsites={getTimeWastingWebsites} getTimeWasted={getTimeWasted} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TimeWasted;