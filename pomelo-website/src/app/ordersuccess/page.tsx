
"use client";

import { Message, NavBar } from "@/components";
import "./page.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PaypalSubscriptionStatus } from "@/constants/PaypalSubscriptionStatus";
import config from "@/constants/config";
import { checkStatusCode } from "@/services/checkStatusCode";
import getNewToken from "@/services/getNewToken";
import MessageTypes from "@/constants/messageTypes";

const OrderSuccess = () =>
{
	const [ isError, setIsError ] = useState<boolean>(false);
    const [ errorMessage, setErrorMessage ] = useState<string>("");
	const [ isActive, setIsActive ] = useState<boolean>(false);
	const [ intervalId, setIntervalId ] = useState<number>();
	
	const getSubscriptionStatus = () =>
	{        
		setIsError(false);

		fetch(config.baseURL + config.subscriptionDetails, {
			method: "GET",
			headers:
			{
				"Authorization": "Bearer " + window.localStorage.getItem("token"),
			},
		})
		.then(async (subscriptionDetailsResponse) =>
		{
			const subscriptionDetailsResponseJson = await subscriptionDetailsResponse.json();

			if (!checkStatusCode(subscriptionDetailsResponse.status))
			{
				setIsError(true);
				setErrorMessage(subscriptionDetailsResponseJson.status);
			}
			else
			{
				if (subscriptionDetailsResponseJson.subscriptionStatus == PaypalSubscriptionStatus.Active)
				{
					window.clearInterval(intervalId);

					getNewToken()
					.then(() =>
					{
						setIsActive(true);
					})
					.catch(() =>
					{
						setIsError(true);
						setErrorMessage("Failed to issue token. Log out and then log back in to fix this problem.");
					});
					
				}

			}

		});

	};

	useEffect(() =>
	{
		setIntervalId(window.setInterval(getSubscriptionStatus, 2000));
	}, []);

    return (
		<>
			<NavBar />
			
			<div className="content-container">
                <div className="order-success-wrapper">

					{ isError && <>
						<Message type={MessageTypes.Error} message={errorMessage} />
					</> }

					<div className="text-with-image">
						<Image src="/assets/pomelo.svg" height={48} width={48} alt="Pomelo logo" />
						<span className="order-success-title">Thank you for registering with Pomelo!</span>
					</div>

					<div className="order-success-status-wrapper">
						<div className="text-with-image">
							<span className="order-success-status">Your subscription status is: </span>
							{ !isActive && <>
								<Image src="/assets/spinner.svg" className="spinner" height={48} width={48} alt="Loading spinner" />
								<span className="order-success-pending">Pending</span>
							</> || <>
								<span className="order-success-active">Active</span>
							</> }
						</div>
						<span className="order-success-status-small">Wait on this page until your subscription status becomes "Active". If it takes longer than a couple minutes, log out and back in.</span>
					</div>

					<div className="order-success-status-wrapper">
						<span className="order-success-subtitle">To use Pomelo, you will need to install and log into the browser extension.</span>
						<span className="order-success-next-steps">After you do that, you can check back at the <a href="/dashboard">Dashboard</a> to set browsing rules or talk to your productivity assistant.</span>
						<div className="order-success-btn-row-wrapper">
							<a className="btn-primary-with-image">
								<Image src="/assets/firefox.png" height={24} width={24} alt="Firefox logo" />
								Firefox
							</a>
							<a className="btn-primary-with-image">
								<Image src="/assets/chrome.png" height={24} width={24} alt="Chrome logo" />
								Chrome
							</a>
							<a className="btn-primary-with-image">
								<Image src="/assets/safari.png" height={24} width={24} alt="Safari logo" />
								Safari
							</a>
						</div>
					</div>

				</div>
			</div>
		</>
	);
};

export default OrderSuccess;