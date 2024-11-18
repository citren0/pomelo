
import React from "react";
import "./page.css";
import { NavBar, Cookies } from "../../components";
import VerifyEmailForm from "./VerifyEmailForm/VerifyEmailForm";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Verify Email - Pomelo",
};

const VerifyEmail = () =>
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

export default VerifyEmail;