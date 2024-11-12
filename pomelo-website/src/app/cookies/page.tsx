
import { Cookies, NavBar } from "@/components";
import cookiesPolicy from "./cookiesPolicy";
import "./page.css";


const CookiesPage = () =>
{
    return (
        <>
            <NavBar />
			
			<div className="content-container">
                <div className="cookies-policy-wrapper">
                    <div dangerouslySetInnerHTML={{ __html: cookiesPolicy, }}></div>
                </div>
			</div>

			<Cookies />
        </>
    );
};

export default CookiesPage;