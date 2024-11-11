
import React from "react";
import "./page.css";
import { Landing, NavBar } from "../components";
import Cookies from "@/components/Cookies/Cookies";

const Home = () =>
{
	return (
		<>
			<NavBar />

			<div className="content-container">
				<Landing />
			</div>

			<Cookies />
		</>
	);
};

export default Home;