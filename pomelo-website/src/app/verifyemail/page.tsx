
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import VerifyEmailForm from "./VerifyEmailForm/VerifyEmailForm";
import Cookies from "@/components/Cookies/Cookies";

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

			<Cookies />
		</>
	);
};

export default Login;