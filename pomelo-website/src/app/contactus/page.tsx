
import React from "react";
import "./page.css";
import { NavBar, Cookies } from "../../components";
import Image from "next/image";


const ContactUs = () =>
{
	return (
		<>
			<NavBar />

			<div className="content-container">
				<div className="contact-us-container">
					<span className="contact-us-title">
						Need help?
					</span>
					<span className="contact-us-subtitle">
						Email us at the address below:
					</span>
                    <Image src={"/assets/email.png"} height={90} width={600} alt={"Pomelo email."} className="contact-us-image" />
				</div>
			</div>

			<Cookies />
		</>
	);
};

export default ContactUs;