
"use client";

import React, { useEffect, useState } from "react";
import "./page.css";
import { NavBar, Cookies, Footer } from "../../components";
import Reports from "./Reports/Reports";
import Insights from "./Insights/Insights";
import Rules from "./Rules/Rules";
import { Rule } from "@/interfaces/Rule";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";


const Dashboard = () =>
{
	const [ rules, setRules ] = useState<Rule[]>([]);

	const getRules = (): Promise<void | string> =>
	{
		return new Promise<void | string>((resolve, reject) =>
		{
			fetch(config.baseURL + config.getRules, {
				method: "GET",
				headers:
				{
					"Authorization": "Bearer " + window.localStorage.getItem("token"),
				}
			})
			.then(async (getRulesResponse) =>
			{
				const getRulesResponseJson = await getRulesResponse.json();

				if (!checkStatusCode(getRulesResponse.status))
				{
					reject(getRulesResponseJson.status);
				}
				else
				{
					setRules(getRulesResponseJson.rules);
					resolve();
				}

			})
			.catch(() =>
			{
				reject("Error encountered. Try again later.");
			});

		});

	};

	useEffect(() =>
	{
		getRules()
	}, []);

	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<Reports />
				<Insights getRules={getRules} />
				<Rules rules={rules} getRules={getRules} />
			</div>

			<Footer />

			<Cookies />
		</>
	);
};

export default Dashboard;