
import { NavBar, Cookies } from "@/components";
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

			<Cookies />
		</>
    );
};

export default ForgotPassword;