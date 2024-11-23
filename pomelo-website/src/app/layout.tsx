import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

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
				<Script type="text/javascript" async defer src="/x.js" />
				<Script type="text/javascript" async defer src="https://www.googletagmanager.com/gtag/js?id=AW-16791297417" />
			</head>
			<link rel="icon" href="/assets/pomelo.png" sizes="any" />
			<body>
				{children}
			</body>
		</html>
	);
}

export default RootLayout;