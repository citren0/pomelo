
import React from "react";
import "./Message.css";
import MessageTypes from "../../constants/messageTypes";

interface Props
{
    type: MessageTypes;
    message: string;
};

const Message = ({ type, message }: Props) =>
{
    return (
        <>
            <div className={"message-wrapper message-" + type}>
                {message}
            </div>
        </>
    );
};

export default Message;