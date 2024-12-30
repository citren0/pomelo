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
				<Script async src="https://www.googletagmanager.com/gtag/js?id=AW-16791297417"></Script>
				<Script type="text/javascript" async defer src="/gtag.js" />
			</head>
			<body>
				{children}
			</body>
			<CheckToken />
		</html>
	);
}

export default RootLayout;