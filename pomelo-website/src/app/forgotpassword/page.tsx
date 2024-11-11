
import { NavBar } from "@/components";
import ForgotPasswordForm from "./ForgotPasswordForm/ForgotPasswordForm";
import "./page.css";
import Cookies from "@/components/Cookies/Cookies";


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