
import React from "react";
import "./SimpleInput.css";


interface Props
{
    type: string;
    label: string;
    id: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SimpleInput = ({ type, label, id, placeholder, onChange }: Props) =>
{
    return (
        <>
            <div className="simple-input-wrapper">
                <label
                    htmlFor={id}
                    className="simple-input-label"
                >
                    {label}
                </label>
                <input
                    type={type}
                    className="simple-input"
                    id={id}
                    placeholder={placeholder}
                    onChange={onChange}
                />
            </div>
        </>
    );
};

export default SimpleInput;