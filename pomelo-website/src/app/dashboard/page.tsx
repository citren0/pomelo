
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import Reports from "./Reports/Reports";

const Dashboard = () =>
{
	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<Reports />
			</div>
		</>
	);
};

export default Dashboard;