
import React from "react";
import "./page.css";
import { Landing, NavBar } from "../components";

const Home = () =>
{
	return (
		<>
			<NavBar />

			<div className="content-container">
				<Landing />
			</div>
		</>
	);
};

export default Home;