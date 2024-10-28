
"use client";

import React, { useEffect, useState } from "react";
import "./SimpleTextArea.css";


interface Props
{
    label: string;
    id: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    clear?: boolean;
};

const SimpleTextArea = ({ label, id, placeholder, onChange, clear }: Props) =>
{
    const [ value, setValue ] = useState<string>("");

    const localChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        onChange?.(e);

        setValue(e.currentTarget.value);
    };

    useEffect(() =>
    {
        setValue("");
    }, [clear]);

    return (
        <>
            <div className="simple-text-area-wrapper">
                <label
                    htmlFor={id}
                    className="simple-text-area-label"
                >
                    {label}
                </label>
                <textarea
                    className="simple-text-area"
                    id={id}
                    placeholder={placeholder}
                    onChange={localChange}
                    rows={2}
                    cols={50}
                    value={value}
                >
                </textarea>
            </div>
        </>
    );
};

export default SimpleTextArea;