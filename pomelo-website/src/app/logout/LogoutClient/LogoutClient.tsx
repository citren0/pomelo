
"use client";

import { useEffect } from "react";


const LogoutClient = () =>
{
    useEffect(() =>
    {
        window.localStorage.clear();

        window.location.href = "/";
    }, []);

    return (
        <></>
    );
};

export default LogoutClient;