
import { NavBar } from "@/components";
import ResetPasswordForm from "./ResetPasswordForm/ResetPasswordForm";
import "./page.css";
import Cookies from "@/components/Cookies/Cookies";


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