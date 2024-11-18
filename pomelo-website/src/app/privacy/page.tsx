
import { NavBar, Cookies } from "@/components";
import privacy from "./privacy";
import "./page.css";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Privacy Policy - Pomelo",
};

const Privacy = () =>
{
    return (
        <>
            <NavBar />
			
			<div className="content-container">
                <div className="privacy-policy-wrapper">
                    <div dangerouslySetInnerHTML={{ __html: privacy }}></div>
                </div>
			</div>

			<Cookies />
        </>
    );
};

export default Privacy;