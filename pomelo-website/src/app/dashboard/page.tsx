
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import Reports from "./Reports/Reports";
import Insights from "./Insights/Insights";
import Strategy from "./Strategy/Strategy";

const Dashboard = () =>
{
	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<Reports />
				<Strategy />
				<Insights />
			</div>
		</>
	);
};

export default Dashboard;