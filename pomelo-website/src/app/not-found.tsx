
import React from "react";
import "./page.css";
import { NavBar, Cookies } from "../components";

const Page404 = () =>
{
	return (
		<>
			<NavBar />

			<div className="content-container">
				<div className="not-found-container">
					<span className="not-found-title">
						404
					</span>
					<span className="not-found-subtitle">
						We didn&apos;t find what you&apos;re looking for.
					</span>
				</div>
			</div>

			<Cookies />
		</>
	);
};

export default Page404;