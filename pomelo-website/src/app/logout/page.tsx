
import React from "react";
import "./page.css";
import { NavBar, Cookies } from "../../components";
import LogoutClient from "./LogoutClient/LogoutClient";


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