
import React, { useEffect } from "react";
import "./page.css";
import { NavBar } from "../../components";
import UserInfo from "./UserInfo/UserInfo";
import Subscription from "./Subscription/Subscription";

const Login = () =>
{

	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<UserInfo />
				<Subscription />
			</div>
		</>
	);
};

export default Login;