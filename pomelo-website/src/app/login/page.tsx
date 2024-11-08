
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import Image from "next/image";
import LoginForm from "./LoginForm/LoginForm";

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
		</>
	);
};

export default Login;