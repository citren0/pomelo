
import { NavBar, Cookies } from "@/components";
import "./page.css";
import Image from "next/image";
import { Metadata } from "next";
import SubscriptionStatus from "./SubscriptionStatus/SubscriptionStatus";
import Script from "next/script";


export const metadata: Metadata = {
    title: "Subscription - Pomelo",
};

const OrderSuccess = () =>
{
    return (
		<>
			<NavBar />

			<Script type="text/javascript" async defer src="/postpurchase.js" />
			
			<div className="content-container">
                <div className="order-success-wrapper">

					<div className="text-with-image">
						<Image src="/assets/pomelo.svg" height={48} width={48} alt="Pomelo logo" />
						<span className="order-success-title">Thank you for registering with Pomelo!</span>
					</div>

					<SubscriptionStatus />

					<div className="order-success-status-wrapper">
						<span className="order-success-subtitle">To use Pomelo, you will need to install and log into the browser extension.</span>
						<span className="order-success-next-steps">After you do that, you can check back at the <a href="/dashboard">Dashboard</a> to set browsing rules or talk to your productivity assistant.</span>
						<div className="order-success-btn-row-wrapper">
							<a className="btn-primary-with-image" href="https://addons.mozilla.org/en-US/firefox/addon/pomelo-productivity/">
								<Image src="/assets/firefox.png" height={24} width={24} alt="Firefox logo" />
								Firefox
							</a>
							<a className="btn-primary-with-image" href="https://chromewebstore.google.com/detail/pomelo/licdjpgagagjhlbpigijhjaepohieman">
								<Image src="/assets/chrome.png" height={24} width={24} alt="Chrome logo" />
								Chrome
							</a>
							{/* <a className="btn-primary-with-image-disabled">
								<Image src="/assets/safari.png" height={24} width={24} alt="Safari logo" />
								Safari
							</a> */}
						</div>
					</div>

				</div>
			</div>

			<Cookies />
		</>
	);
};

export default OrderSuccess;