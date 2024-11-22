
import Image from "next/image";
import "./Footer.css";

const Footer = () =>
{
    return (
        <>
            <div className="footer-wrapper">
                <div className="nav-logo-wrapper">
                    <Image
                        src="/assets/pomelo.svg"
                        alt="Pomelo Logo"
                        width={44}
                        height={44}
                        className="nav-logo"
                    />
                    <span className="nav-title">Pomelo</span>
                </div>
                <div className="footer-grouping">
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/cookies">Cookie Policy</a>
                    <a href="/datarequest">Request Your Data</a>
                    <a href="/contactus">Support</a>
                </div>
            </div>
        </>
    );
};

export default Footer;