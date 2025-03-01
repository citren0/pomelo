
import React from "react";
import "./page.css";
import { NavBar, Cookies } from "../../components";
import UserInfo from "./UserInfo/UserInfo";
import Subscription from "./Subscription/Subscription";
import DeleteAccount from "./DeleteAccount/DeleteAccount";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Profile - Pomelo",
};

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