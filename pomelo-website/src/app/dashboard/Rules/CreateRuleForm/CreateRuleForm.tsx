
"use client";

import { Message, SimpleInput } from "@/components";
import "./CreateRuleForm.css";
import SimpleDropdown from "@/components/SimpleDropdown/SimpleDropdown";
import dropdownHours from "@/constants/dropdownHours";
import { useState } from "react";
import MessageTypes from "@/constants/messageTypes";
import putRule from "@/services/putRule";
import DaysOfTheWeek from "@/interfaces/DaysOfTheWeek";


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
    const [ daysOfWeek, setDaysOfWeek ] = useState<DaysOfTheWeek>({
                                                                    sunday: false,
                                                                    monday: false,
                                                                    tuesday: false,
                                                                    wednesday: false,
                                                                    thursday: false,
                                                                    friday: false,
                                                                    saturday: false,
                                                                });

    const putRuleDecorator = () =>
    {
        setIsError(false);
        putRule(domain, start, stop, daysOfWeek)
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
                
                <div className="create-rule-check-flex">
                    <div className="create-rule-check-with-label">
                        <input type="checkbox" id="sunday" className="create-rule-checkbox" onClick={() => setDaysOfWeek({ ...daysOfWeek, sunday: true, })} />
                        <span className="create-rule-checkbox-custom">✔</span>
                        <label htmlFor="sunday">S</label>
                    </div>
                    <div className="create-rule-check-with-label">
                        <input type="checkbox" id="monday" className="create-rule-checkbox" onClick={() => setDaysOfWeek({ ...daysOfWeek, monday: true, })} />
                        <span className="create-rule-checkbox-custom">✔</span>
                        <label htmlFor="monday">M</label>
                    </div>
                    <div className="create-rule-check-with-label">
                        <input type="checkbox" id="tuesday" className="create-rule-checkbox" onClick={() => setDaysOfWeek({ ...daysOfWeek, tuesday: true, })} />
                        <span className="create-rule-checkbox-custom">✔</span>
                        <label htmlFor="tuesday">T</label>
                    </div>
                    <div className="create-rule-check-with-label">
                        <input type="checkbox" id="wednesday" className="create-rule-checkbox" onClick={() => setDaysOfWeek({ ...daysOfWeek, wednesday: true, })} />
                        <span className="create-rule-checkbox-custom">✔</span>
                        <label htmlFor="wednesday">W</label>
                    </div>
                    <div className="create-rule-check-with-label">
                        <input type="checkbox" id="thursday" className="create-rule-checkbox" onClick={() => setDaysOfWeek({ ...daysOfWeek, thursday: true, })} />
                        <span className="create-rule-checkbox-custom">✔</span>
                        <label htmlFor="thursday">T</label>
                    </div>
                    <div className="create-rule-check-with-label">
                        <input type="checkbox" id="friday" className="create-rule-checkbox" onClick={() => setDaysOfWeek({ ...daysOfWeek, friday: true, })} />
                        <span className="create-rule-checkbox-custom">✔</span>
                        <label htmlFor="friday">F</label>
                    </div>
                    <div className="create-rule-check-with-label">
                        <input type="checkbox" id="saturday" className="create-rule-checkbox" onClick={() => setDaysOfWeek({ ...daysOfWeek, saturday: true, })} />
                        <span className="create-rule-checkbox-custom">✔</span>
                        <label htmlFor="saturday">S</label>
                    </div>
                </div>

                <button className="form-primary-button" onClick={putRuleDecorator}>Create</button>
            </div>
        </>
    );
};

export default CreateRuleForm;