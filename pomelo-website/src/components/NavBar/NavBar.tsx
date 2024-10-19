
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
            <div className="nav-wrapper">
                <Image
                    src="/assets/pomelo.svg"
                    alt="Pomelo Logo"
                    width={48}
                    height={48}
                    className="nav-logo"
                />
                <span className="nav-title">Pomelo Productivity</span>

                <div className="nav-buttons">
                    <a
                        className="nav-link"
                        href="/"
                    >Home</a>
                    <a
                        className="nav-link"
                        href="/login"
                    >Login</a>
                    <a
                        className="nav-link"
                        href="/register"
                    >Register</a>
                    { isLoggedIn && <>
                        <a
                            className="nav-link"
                            href="/profile"
                        >Profile</a>
                        <a
                            className="nav-link"
                            href="/dashboard"
                        >Dashboard</a>
                        <a
                            className="nav-link"
                            href="/logout"
                        >Logout</a>
                    </> }
                </div>
                
            </div>
        </>
    );
};

export default NavBar;