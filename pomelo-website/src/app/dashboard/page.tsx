
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import Reports from "./Reports/Reports";
import Insights from "./Insights/Insights";

const Dashboard = () =>
{
	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<Reports />
				<Insights />
			</div>
		</>
	);
};

export default Dashboard;