
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./NavBar.css";


const NavBar = () =>
{
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);

    useEffect(() =>
    {
        if (window.localStorage.getItem("token") != null)
        {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <>
            <div className="nav-wrapper" style={{}}>
                <a href="/" className="a-no-dec">
                    <div className="nav-logo-wrapper">
                        <Image
                            src="/assets/pomelo.svg"
                            alt="Pomelo Logo"
                            width={48}
                            height={48}
                            className="nav-logo"
                        />
                        <span className="nav-title nav-btn-collapse">Pomelo</span>
                    </div>
                </a>

                <div className="nav-buttons">

                    { !isLoggedIn && <>
                        <div className="nav-notsignedin-buttons">
                            <a
                                className="nav-link-prominent"
                                href="/register"
                            >Register</a>
                            <a
                                className="nav-link-prominent-secondary"
                                href="/login"
                            >Login</a>
                        </div>
                    </> }
                    
                    { isLoggedIn && <>
                        <div className="nav-btn-grouping">
                            <a className="nav-link-ext" href="/dashboard" title="Dashboard">
                                <Image src="/assets/report.svg" height={28} width={28} alt="Dashboard" />
                            </a>
                            <a className="nav-link-ext" href="/profile" title="User's Profile">
                                <Image src="/assets/profile.svg" height={28} width={28} alt="User's profile" />
                            </a>
                            <a className="nav-link-ext" href="/logout" title="Log Out">
                                <Image src="/assets/log-out.svg" height={28} width={28} alt="Log Out" />
                            </a>
                        </div>
                    </> }
                </div>
            </div>
        </>
    );
};

export default NavBar;