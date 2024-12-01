
import React from "react";
import "./page.css";
import { NavBar, Cookies } from "../../components";


const DataRequest = () =>
{
	return (
		<>
			<NavBar />

			<div className="content-container">
				<div className="data-request-container">
					<span className="data-request-title">
						Want your data?
					</span>
					<span className="data-request-subtitle">
						Email us at the address below:
					</span>
                    <img src={"/assets/email.png"} height={90} width={600} alt={"Pomelo email."} className="contact-us-image" />
				</div>
			</div>

			<Cookies />
		</>
	);
};

export default DataRequest;