
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
import TimeWasted from "./TimeWasted/TimeWasted";


enum DashboardPages
{
	reports = "reports",
	timewasted = "time wasted",
	rules = "rules",
};

const Dashboard = () =>
{
	const [ rules, setRules ] = useState<Rule[]>([]);
	const [ currPage, setCurrPage ] = useState<DashboardPages>(DashboardPages.reports);

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
				<div className="dashboard-wrapper">
					<div className="dashboard-menu">
						{ currPage == DashboardPages.reports && <>
							<button className="dashboard-button-active" onClick={() => setCurrPage(DashboardPages.reports)}>
								<img src="/assets/chat-bubble.svg" height={32} width={32} alt="AI Coach" title="AI Coach" />
							</button>
						</> || <>
							<button className="dashboard-button" onClick={() => setCurrPage(DashboardPages.reports)}>
								<img src="/assets/chat-bubble.svg" height={32} width={32} alt="AI Coach" title="AI Coach" />
							</button>
						</> }

						{ currPage == DashboardPages.rules && <>
							<button className="dashboard-button-active" onClick={() => setCurrPage(DashboardPages.rules)}>
								<img src="/assets/lock-square.svg" height={32} width={32} alt="Blocking Rules" title="Your Rules" />
							</button>
						</> || <>
							<button className="dashboard-button" onClick={() => setCurrPage(DashboardPages.rules)}>
								<img src="/assets/lock-square.svg" height={32} width={32} alt="Blocking Rules" title="Your Rules" />
							</button>
						</> }

						{ currPage == DashboardPages.timewasted && <>
							<button className="dashboard-button-active" onClick={() => setCurrPage(DashboardPages.timewasted)}>
								<img src="/assets/timer.svg" height={32} width={32} alt="Time Wasted" title="Your Wasted Time" />
							</button>
						</> || <>
							<button className="dashboard-button" onClick={() => setCurrPage(DashboardPages.timewasted)}>
								<img src="/assets/timer.svg" height={32} width={32} alt="Time Wasted" title="Your Wasted Time" />
							</button>
						</> }
					</div>

					<div className="dashboard-content">
						{ currPage == DashboardPages.reports && <>
							<Reports />
							<hr className="hr-100" />
							<Insights getRules={getRules} />
						</> }
						{ currPage == DashboardPages.rules && <>
							<Rules rules={rules} getRules={getRules} />
						</> }
						{ currPage == DashboardPages.timewasted && <>
							<TimeWasted />
						</> }
					</div>
				</div>
			</div>

			<Footer />

			<Cookies />
		</>
	);
};

export default Dashboard;