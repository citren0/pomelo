
import React from "react";
import "./page.css";
import { NavBar } from "../../components";
import RegisterForm from "./RegisterForm/RegisterForm";
import Cookies from "@/components/Cookies/Cookies";

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

			<Cookies />
		</>
	);
};

export default Register;