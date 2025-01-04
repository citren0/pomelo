
import React from "react";
import "./page.css";
import { Footer, Landing, NavBar, Cookies } from "../components";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Pomelo Productivity",
};

const Home = () =>
{
	return (
		<>
			<NavBar sticky={true} />

			<div className="content-container">
				<Landing />
			</div>

			<Footer />

			<Cookies />
		</>
	);
};

export default Home;