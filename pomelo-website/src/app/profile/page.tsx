
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import UserInfo from "./UserInfo/UserInfo";
import Subscription from "./Subscription/Subscription";
import DeleteAccount from "./DeleteAccount/DeleteAccount";
import Cookies from "@/components/Cookies/Cookies";

const Login = () =>
{

	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<UserInfo />
				<Subscription />
				<DeleteAccount />
			</div>

			<Cookies />
		</>
	);
};

export default Login;