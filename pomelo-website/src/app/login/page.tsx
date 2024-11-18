
import React from "react";
import "./page.css";
import { NavBar, Cookies } from "../../components";
import LoginForm from "./LoginForm/LoginForm";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Login - Pomelo",
};

const Login = () =>
{
	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<div className="login-image-and-form">
					<LoginForm />
				</div>
			</div>

			<Cookies />
		</>
	);
};

export default Login;