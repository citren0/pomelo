
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import Image from "next/image";
import VerifyEmailForm from "./VerifyEmailForm/VerifyEmailForm";

const Login = () =>
{
	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<div className="verifyemail-form-wrapper">
					<VerifyEmailForm />
				</div>
			</div>
		</>
	);
};

export default Login;