import type { Metadata } from "next";
import "./globals.css";

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
				<script>
					{"!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','orm5f');"}
				</script>
			</head>
			<link rel="icon" href="/assets/pomelo.png" sizes="any" />
			<body>
				{children}
			</body>
		</html>
	);
}

export default RootLayout;