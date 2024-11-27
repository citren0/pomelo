
"use client";

import { useEffect } from "react";


const CheckToken = () =>
{
    useEffect(() =>
    {
        const now = Date.now();
        const expiry = parseInt(window.localStorage.getItem('token_expires') ?? "0");

        if (now >= expiry && expiry != 0)
        {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('token_expires');

            window.location.href = "/";
        }
    });
    return <></>;
};

export default CheckToken;