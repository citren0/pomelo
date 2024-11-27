
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
                                            <span className="rule-number">{idx + 1}</span>
                                            <span className="rule-domain">{ rule.domain } from { hoursDictionary[String(rule.start)] } to { hoursDictionary[String(rule.stop)] }</span>
                                            <button className="btn-image" onClick={() => deleteRule(rule.domain, rule.start, rule.stop)}>
                                                <Image src={"/assets/trash.svg"} height={24} width={24} alt={"Trash can icon"} />
                                            </button>
                                        </div>
                                        <hr className="hr-100" />
                                    </>
                                );
                            })
                        }

                        { rules.length == 0 && !isError && <>
                            <span className="rules-non-found-text">No rules found.</span>
                        </> }
                    </div>

                    <CreateRuleForm getRules={getRulesDecorator} />
                </div>
            </div>
        </>
    );
};

export default Rules;