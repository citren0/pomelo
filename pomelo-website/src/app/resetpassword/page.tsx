
import { NavBar, Cookies } from "@/components";
import ResetPasswordForm from "./ResetPasswordForm/ResetPasswordForm";
import "./page.css";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Reset Password - Pomelo",
};

const ForgotPassword = () =>
{
    return (
        <>
			<NavBar />
			
			<div className="content-container">
				<div className="reset-password-form-spacer">
					<ResetPasswordForm />
				</div>
			</div>

			<Cookies />
		</>
    );
};

export default ForgotPassword;