
"use client";

import React, { useState } from "react";
import "./page.css";
import { NavBar } from "../../components";
import Reports from "./Reports/Reports";
import Insights from "./Insights/Insights";
import Strategy from "./Strategy/Strategy";


const Dashboard = () =>
{
	const [ doNewStrategy, setDoNewStrategy ] = useState<boolean>(false);
	const [ newStrategy, setNewStrategy ] = useState<string>("");

	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<Reports />
				<Strategy newStrategy={newStrategy} doNewStrategy={doNewStrategy} resetDoNewStrategy={() => setDoNewStrategy(false)} />
				<Insights
					onStrategyChange={
						(strategy: string) =>
						{
							setNewStrategy(strategy);
							setDoNewStrategy(true);
						}
					}
				/>
			</div>
		</>
	);
};

export default Dashboard;