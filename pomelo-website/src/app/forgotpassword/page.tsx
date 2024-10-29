
import { NavBar } from "@/components";
import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm";
import "./page.css";


const ForgotPassword = () =>
{
    return (
        <>
			<NavBar />
			
			<div className="content-container">
				<div className="forgot-password-form-spacer">
					<ForgotPasswordForm />
				</div>
			</div>
		</>
    );
};

export default ForgotPassword;