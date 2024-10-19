
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import RegisterForm from "./RegisterForm/RegisterForm";

const Login = () =>
{
	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<div className="login-image-and-form">
					<RegisterForm />
				</div>
			</div>
		</>
	);
};

export default Login;