
import React from "react";
import "./page.css";
import { Footer, Landing, NavBar, Cookies } from "../components";

const Home = () =>
{
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