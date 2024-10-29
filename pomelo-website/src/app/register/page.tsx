
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import RegisterForm from "./RegisterForm/RegisterForm";

const Register = () =>
{
	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<div className="register-form-spacer">
					<RegisterForm />
				</div>
			</div>
		</>
	);
};

export default Register;