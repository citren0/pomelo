import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { CheckToken } from "@/components";

export const metadata: Metadata = {
	title: "Pomelo",
	description: "Track your productivity and cut down on wasted time with Pomelo, your personal productivity coach.",
};

const RootLayout = (
{
	children, 
}: Readonly<{ children: React.ReactNode; }>) =>
{
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/assets/pomelo.png" sizes="any" />
				<Script type="text/javascript" async defer src="/gtag.js" />
			</head>
			<body>
				<noscript>
					<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PP4CSB2F" height="0" width="0" style={{display: "none", visibility: "hidden", }}></iframe>
				</noscript>
				{children}
			</body>
			<CheckToken />
		</html>
	);
}

export default RootLayout;