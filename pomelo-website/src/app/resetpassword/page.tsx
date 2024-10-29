
import { NavBar } from "@/components";
import ResetPasswordForm from "./ResetPasswordForm/ResetPasswordForm";
import "./page.css";


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
		</>
    );
};

export default ForgotPassword;