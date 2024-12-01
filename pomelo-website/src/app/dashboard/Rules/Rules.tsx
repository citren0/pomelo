
"use client";

import { useEffect, useState } from "react";
import "./Rules.css";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";
import Image from "next/image";
import CreateRuleForm from "./CreateRuleForm/CreateRuleForm";
import { Message } from "@/components";
import MessageTypes from "@/constants/messageTypes";
import { Rule } from "@/interfaces/Rule";
import { hoursDictionary } from "@/constants/dropdownHours";

interface Props
{
    rules: Rule[];
    getRules: () => Promise<void | string>;
};

const Rules = ({rules, getRules}: Props) =>
{
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const deleteRule = (domain: string, start: number, stop: number) =>
    {
        const deleteRulesURLWithQuery = config.baseURL + config.deleteRules + "?" + (new URLSearchParams(
            [
                ["domain", domain],
                ["start", String(start)],
                ["stop", String(stop)]
            ]))

        fetch(deleteRulesURLWithQuery, {
            method: "DELETE",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            }
        })
        .then(async (deleteRuleResponse) =>
        {
            const deleteRuleResponseJson = await deleteRuleResponse.json();

            if (!checkStatusCode(deleteRuleResponse.status))
            {
                setIsError(true);
                setErrorMessage(deleteRuleResponseJson.status);
            }
            else
            {
                getRules();
            }

        })
        .catch(() =>
        {
            setIsError(true);
            setErrorMessage("Error encountered. Try again later.");
        });

    };

    const getRulesDecorator = () =>
    {
        setIsError(false);
        
        getRules()
        .catch((error) =>
        {
            setIsError(true);
            setErrorMessage(error);
        });

    };

    useEffect(() =>
    {
        getRulesDecorator();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <div className="rules-wrapper">
                <span className="rules-title">Your Rules</span>
                <hr className="hr-100" />
                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }
                
                <div className="rules-content">
                    <div className="rules-container">
                        { rules.map((rule, idx) =>
                            {
                                return (
                                    <>
                                        <div className="rule-wrapper">
                                            <div className="rule-row-space-between">
                                                <span className="rule-domain">{ rule.domain }</span>
                                                <button className="btn-image" onClick={() => deleteRule(rule.domain, rule.start, rule.stop)}>
                                                    <Image src={"/assets/trash.svg"} height={26} width={26} alt={"Trash can icon"} />
                                                </button>
                                            </div>
                                            
                                            <div className="rule-row">
                                                <div className="rule-days-wrapper">
                                                    { rule.days.sunday == true && <>
                                                        <div className="rule-days-active"><span>S</span></div>
                                                    </> || <>
                                                        <div className="rule-days-inactive"><span>S</span></div>
                                                    </> }

                                                    { rule.days.monday == true && <>
                                                        <div className="rule-days-active"><span>M</span></div>
                                                    </> || <>
                                                        <div className="rule-days-inactive"><span>M</span></div>
                                                    </> }

                                                    { rule.days.tuesday == true && <>
                                                        <div className="rule-days-active"><span>T</span></div>
                                                    </> || <>
                                                        <div className="rule-days-inactive"><span>T</span></div>
                                                    </> }

                                                    { rule.days.wednesday == true && <>
                                                        <div className="rule-days-active"><span>W</span></div>
                                                    </> || <>
                                                        <div className="rule-days-inactive"><span>W</span></div>
                                                    </> }

                                                    { rule.days.thursday == true && <>
                                                        <div className="rule-days-active"><span>T</span></div>
                                                    </> || <>
                                                        <div className="rule-days-inactive"><span>T</span></div>
                                                    </> }

                                                    { rule.days.friday == true && <>
                                                        <div className="rule-days-active"><span>F</span></div>
                                                    </> || <>
                                                        <div className="rule-days-inactive"><span>F</span></div>
                                                    </> }

                                                    { rule.days.saturday == true && <>
                                                        <div className="rule-days-active"><span>S</span></div>
                                                    </> || <>
                                                        <div className="rule-days-inactive"><span>S</span></div>
                                                    </> }
                                                </div>
                                            </div>

                                            <div className="rule-row">
                                                <span className="rule-domain">{ hoursDictionary[String(rule.start)] } - { hoursDictionary[String(rule.stop)] }</span>
                                            </div>
                                        </div>
                                        <hr className="hr-100" />
                                    </>
                                );
                            })
                        }

                        { rules.length == 0 && !isError && <>
                            <span className="rules-non-found-text">Any websites added here will be blocked between the hours specified.</span>
                        </> }
                    </div>

                    <CreateRuleForm getRules={getRulesDecorator} />
                </div>
            </div>
        </>
    );
};

export default Rules;