
import { FAQItem, SpecialOffer } from "../";
import "./Landing.css";

const Landing = () =>
{
    return (
        <>
            <div className="landing-wrapper">

                <div className="landing-top-wrapper">
                    <span className="landing-title">
                        <span className="landing-title-italic">Say goodbye to wasted time</span> with AI-powered productivity tools.
                    </span>

                    <span className="landing-subtitle">
                        Work with your own AI coach, block websites, and track your progress.
                    </span>

                    <a className="landing-conversion-button" href="/register">Unlock Productivity Now</a>
                </div>

                <hr className="hr-100" />

                <div className="landing-images-flex">
                    <div className="landing-images-wrapper">
                        <span className="landing-card-flex-title">
                            Stay Accountable
                        </span>
                        <img src="/assets/chat.png" height={673} width={800} className="landing-img" alt="A product demo showcasing the Pomelo chat functionality." />
                        <span className="landing-images-explanation">
                            Your personal AI productivity coach will devise strategies to get off of time-wasting websites.
                        </span>
                    </div>
                    <div className="landing-images-wrapper">
                        <span className="landing-card-flex-title">
                            Block Time-Wasters
                        </span>
                        <img src="/assets/blocked.png" height={673} width={800} className="landing-img" alt="A product demo showcasing the website blocking functionality." />
                        <span className="landing-images-explanation">
                            Productivity rules keep you accountable by blocking websites, helping you achieve your goals quicker.
                        </span>
                    </div>
                </div>

                <div className="landing-card-flex">
                    <div className="landing-card">
                        <span className="landing-card-title">Correct Bad Habits in Real-Time</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Keeps an eye on your browsing habits and enforces your website blocks.</span>
                    </div>
                    <div className="landing-card">
                        <span className="landing-card-title">Leverage AI to get true progress</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Your AI coach custom tailors productivity strategies and learns from your habits.</span>
                    </div>
                    <div className="landing-card">
                        <span className="landing-card-title">See Your Progress and Focus on Results</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Monitor your productivity journey by tracking the sites you tend to waste time on.</span>
                    </div>
                </div>

                <hr className="hr-100" />

                <div className="landing-product-demo-flex">
                    <div className="landing-product-demo-col">
                        <span className="landing-product-demo-title">
                            How do I know I&apos;m making progress?
                        </span>

                        <span className="landing-product-demo-text">
                            With Pomelo&apos;s automatic time tracking, you can monitor your time usage online. Make new browsing rules to block your common time wasters.
                        </span>
                    </div>

                    <img src="/assets/chart.png" height={673} width={800} className="landing-img" style={{ width: "30rem" }} alt="A product demo showcasing the Pomelo time-tracking functionality." />
                </div>

                <hr className="hr-100" />

                <span className="landing-card-flex-title">
                    How much does it cost?
                </span>
                
                <div className="landing-card-flex">
                    <div className="landing-card-secondary">
                        <span className="landing-card-title-big">
                            <img src={"/assets/gift.png"} height={48} alt="Gift Icon" style={{ position: "relative", bottom: "5px" }} />
                            Limited Offer:
                        </span>
                        <span className="landing-card-title-big">
                            $4.99 / month
                        </span>
                        <hr className="hr-100" />
                        <span className="landing-card-text-big">All Inclusive Subscription:</span>
                        <ul className="landing-card-list">
                            <li>AI productivity coach</li>
                            <li>Progress tracking</li>
                            <li>Automatic time-tracking</li>
                            <li>Website blocking</li>
                        </ul>
                    </div>
                </div>

                <hr className="hr-100" />

                <span className="landing-card-flex-title">Frequently Asked Questions</span>
                <div className="landing-faq-wrapper">

                    <FAQItem question="What is Pomelo?" answer="Pomelo is a suite of tools used to decrease wasted time on desktop browsers. You can use Pomelo to track your wasted time, chat with a personal AI-powered coach, and block websites." />
                    <FAQItem question="Do I need to be tech-savvy to use Pomelo?" answer="We work hard to make Pomelo as easy to use as possible. You just need to know how to install a web browser and access the dashboard." />
                    <FAQItem question="How hard is Pomelo to set up?" answer="Easy! Create an account, install the browser extension, and Pomelo works in the background to save you time." />
                    <FAQItem question="What if I don't like it?" answer="We want to make things right. If you don't like Pomelo, you can cancel your subscription from the account menu. If you have any issues, email us at noreply@pomeloprod.com." />
                    <FAQItem question="How can I reach support?" answer="Email us personally at noreply@pomeloprod.com for any issues or support. We are here to help at any time!" />
                    <FAQItem question="How much does Pomelo cost?" answer="Pomelo is normally $9.99 USD per month. We occasionally run special deals for lower prices. Prices are guaranteed for as long as the account is open." />
                </div>

                <hr className="hr-100" />

                <div className="landing-supports-flex">
                    <span className="landing-supports-text">Supports: </span>
                    <img src="/assets/firefox.png" height={38} width={38} alt="Firefox logo" />
                    <img src="/assets/chrome.png" height={38} width={38} alt="Chrome logo" />
                </div>
            </div>
        </>
    )
};

export default Landing;