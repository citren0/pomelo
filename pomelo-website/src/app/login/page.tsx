
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
					<Image 
						src="/assets/laptop-portrait.jpg"
						alt="Image of laptop with person typing."
						height={400}
						width={300}
						className="img-border"
					/>
					<LoginForm />
				</div>
			</div>
		</>
	);
};

export default Login;