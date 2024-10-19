import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pomelo",
  description: "Track your productivity across different types of websites.",
};

const RootLayout = (
{
  children, 
}: Readonly<{
  children: React.ReactNode;
}>) =>
{
  return (
    <html lang="en">
      <link rel="icon" href="/assets/pomelo.svg" sizes="any" />
      <body>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;