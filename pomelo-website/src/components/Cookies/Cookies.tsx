
"use client";

import { useEffect, useState } from "react";
import "./Cookies.css";


const Cookies = () =>
{
    const [ showBanner, setShowBanner ] = useState<boolean>(false);

    const consent = () =>
    {
        setShowBanner(false);
        window.localStorage.setItem("cookies", "true");
    };

    useEffect(() =>
    {
        const consent = window.localStorage.getItem("cookies");

        if (consent != "true")
        {
            setShowBanner(true);
        }

    }, []);

    return (
        <>
            { showBanner && <>
                <div className="cookies-wrapper">
                    <div className="cookies-text-wrapper">
                        <span className="cookies-wrapper-main-text">We use cookies to improve our website and provide persisting user sessions. By continuing to use the site, you consent to the use of cookies. To find out more, read our <a href="/privacy" className="cookies-privacy-policy-text">Privacy Policy</a> and <a href="/cookies" className="cookies-privacy-policy-text">Cookie Policy</a></span>
                    </div>
                    <button className="cookies-go-away-button" onClick={consent}>I Understand</button>
                </div>
            </> }
        </>
    );
};

export default Cookies;