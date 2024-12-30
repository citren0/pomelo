
import React from "react";
import "./page.css";
import { NavBar, Cookies, SpecialOffer } from "../../components";
import RegisterForm from "./RegisterForm/RegisterForm";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Register - Pomelo",
};

const Register = () =>
{
	return (
		<>
			<NavBar />
			
			<div className="content-container">
				<div className="register-form-spacer">
                	<SpecialOffer headline="Start the year right with Pomelo." cost="$4.99 / month" validUntil="January 30th 2025" showButton={false} />
					<RegisterForm />
				</div>
			</div>

			<Cookies />
		</>
	);
};

export default Register;