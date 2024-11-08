
"use client";

import { Message, SimpleInput } from "@/components";
import "./CreateRuleForm.css";
import SimpleDropdown from "@/components/SimpleDropdown/SimpleDropdown";
import dropdownHours from "@/constants/dropdownHours";
import { useState } from "react";
import MessageTypes from "@/constants/messageTypes";
import putRule from "@/services/putRule";

interface Props
{
    getRules: () => void;
};

const CreateRuleForm = ({getRules}: Props) =>
{
    const [ domain, setDomain ] = useState<string>("");
    const [ start, setStart ] = useState<number>(0);
    const [ stop, setStop ] = useState<number>(0);
    const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    const putRuleDecorator = () =>
    {
        setIsError(false);
        putRule(domain, start, stop)
        .then(() =>
        {
            getRules();
        })
        .catch((error) =>
        {
            setIsError(true);
            setErrorMessage(error);
        });

    };
    
    return (
        <>
            <div className="create-rule-form-wrapper">
                { isError && <>
                    <Message type={MessageTypes.Error} message={errorMessage} />
                </> }
                
                <span className="create-rule-form-title">Create New Rule</span>
                <SimpleInput label="Domain" type="text" onChange={(e) => setDomain(e.currentTarget.value)} placeholder="example.com" />
                <SimpleDropdown onSelect={(value) => setStart(parseInt(value))} options={dropdownHours} id="create-rule-start" label="Start" />
                <SimpleDropdown onSelect={(value) => setStop(parseInt(value))} options={dropdownHours} id="create-rule-stop" label="Stop" />
                <button className="form-primary-button" onClick={putRuleDecorator}>Create</button>
            </div>
        </>
    );
};

export default CreateRuleForm;