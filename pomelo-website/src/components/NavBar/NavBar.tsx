
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
                <a href="/" className="a-no-dec">
                    <div className="nav-logo-wrapper">
                        <Image
                            src="/assets/pomelo.svg"
                            alt="Pomelo Logo"
                            width={48}
                            height={48}
                            className="nav-logo"
                        />
                        <span className="nav-title">Pomelo</span>
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