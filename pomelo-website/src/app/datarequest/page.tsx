
import React from "react";
import "./page.css";
import { NavBar, Cookies } from "../../components";
import Image from "next/image";


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
                    <Image src={"/assets/email.png"} height={45} width={300} alt={"Pomelo email."} />
				</div>
			</div>

			<Cookies />
		</>
	);
};

export default DataRequest;