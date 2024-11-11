
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import LogoutClient from "./LogoutClient/LogoutClient";
import Cookies from "@/components/Cookies/Cookies";

const Login = () =>
{
	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<div className="logout-container">
					<LogoutClient />
					<span className="logout-title">
						Logging out...
					</span>
				</div>
			</div>

			<Cookies />
		</>
	);
};

export default Login;