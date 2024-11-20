
"use client";
import React, { useEffect } from "react";
import "./page.css";
import { Footer, Landing, NavBar, Cookies } from "../components";
import { Metadata } from "next";
import getNewToken from "@/services/getNewToken";


// export const metadata: Metadata = {
//     title: "Pomelo Productivity",
// };

const Home = () =>
{
	useEffect(() =>
	{
		getNewToken();
	}, []);

	return (
		<>
			<NavBar />

			<div className="content-container">
				<Landing />
			</div>

			<Footer />

			<Cookies />
		</>
	);
};

export default Home;