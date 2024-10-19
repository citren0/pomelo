
import React, { useEffect } from "react";
import "./page.css";
import { NavBar } from "../../components";
import UserInfo from "./UserInfo/UserInfo";

const Login = () =>
{

	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<UserInfo />
			</div>
		</>
	);
};

export default Login;