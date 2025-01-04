
"use client";
import { useState } from "react";
import "./FAQItem.css";


interface Props
{
    question: string;
    answer: string;
}

const FAQItem = ({question, answer}: Props) =>
{
    const [ isOpen, setIsOpen ] = useState<boolean>(false);


    return (
        <>
            <button className="landing-faq-item" onClick={() => setIsOpen(!isOpen)}>
                <span className="landing-faq-text">
                    <span className="landing-faq-bold">Q: </span>{question}
                </span>

                <div className="landing-faq-answer" style={{ maxHeight: (isOpen) ? "5rem" : "0px" }}>
                    <span className="landing-faq-text">
                        <span className="landing-faq-bold">A: </span>{answer}
                    </span>
                </div>
            </button>
        </>
    );
};

export default FAQItem;