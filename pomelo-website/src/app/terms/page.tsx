
import { Cookies, NavBar } from "@/components";
import "./page.css";
import tos from "./tos";


const Terms = () =>
{
    return (
        <>
            <NavBar />
			
			<div className="content-container">
                <div className="tos-policy-wrapper">
                    <div dangerouslySetInnerHTML={{ __html: tos, }}></div>
                </div>
			</div>

			<Cookies />
        </>
    );
};

export default Terms;