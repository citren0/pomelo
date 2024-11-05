
import { NavBar } from "@/components";
import "./page.css";
import Image from "next/image";

const OrderSuccess = () =>
{
    return (
		<>
			<NavBar />
			
			<div className="content-container">
                <div className="order-success-wrapper">
					<span className="order-success-title">Thank you for registering with Pomelo!</span>
					<span className="order-success-subtitle">To use Pomelo, you will need to install the browser extension and log in with your account.</span>
					<span className="order-success-next-steps">After you install the browser extension and log in, you can check back at the <a href="/dashboard">Dashboard</a> to set browsing rules or talk to your productivity coach.</span>
					<div className="order-success-btn-row-wrapper">
						<a className="btn-primary-with-image">
							<Image src="/assets/firefox.png" height={30} width={30} alt="Firefox logo" />
							Firefox
						</a>
						<a className="btn-primary-with-image">
							<Image src="/assets/chrome.png" height={30} width={30} alt="Firefox logo" />
							Chrome
						</a>
						<a className="btn-primary-with-image">
							<Image src="/assets/safari.png" height={30} width={30} alt="Firefox logo" />
							Safari
						</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrderSuccess;