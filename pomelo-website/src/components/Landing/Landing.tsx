
import "./Landing.css";

const Landing = () =>
{
    return (
        <>
            <div className="landing-wrapper">
                <span className="landing-title">
                    Save time for the things you <span className="landing-title-italic">really</span> care about.&nbsp;
                </span>
                <span className="landing-subtitle">
                    Get&nbsp;<span className="landing-subtitle-bold">real results</span>&nbsp;with automatic time-tracking, website blocking, and your own productivity coach.
                </span>

                <div className="landing-images-flex">
                    <div className="landing-images-wrapper">
                        <img src="/assets/chat.png" height={673} width={800} className="landing-img" alt="A product demo showcasing the Pomelo chat functionality." />
                        <span className="landing-images-explanation">
                            Your personal coach will recommend productivity strategies and block time-wasting websites.
                        </span>
                    </div>
                    <div className="landing-images-wrapper">
                        <img src="/assets/blocked.png" height={673} width={800} className="landing-img" alt="A product demo showcasing the website blocking functionality." />
                        <span className="landing-images-explanation">
                            Productivity rules keep you accountable by blocking websites during certain times of day.
                        </span>
                    </div>
                </div>

                <a className="landing-conversion-button" href="/register">Get Started</a>

                <hr className="hr-100" />

                <span className="landing-card-flex-title">
                    How does it work?
                </span>
                <div className="landing-card-flex">
                    <div className="landing-card">
                        <span className="landing-card-title">Report Habits in Real-Time</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Keeps an eye on your browsing habits and enforces your website blocks.</span>
                    </div>
                    <div className="landing-card">
                        <span className="landing-card-title">Generate Insights with AI</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Your productivity coach and automatic time-tracking will help you learn from your habits.</span>
                    </div>
                    <div className="landing-card">
                        <span className="landing-card-title">Focus on Results</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Keep track of your productivity journey by noting the websites you tend to waste time on.</span>
                    </div>
                </div>

                <hr className="hr-100" />

                <div className="landing-product-demo-flex">
                    <div className="landing-product-demo-col">
                        <span className="landing-product-demo-title">
                            How do I know I&apos;m making progress?
                        </span>

                        <span className="landing-product-demo-text">
                            With Pomelo&apos;s automatic time tracking, you can see how much time you spend online and how much time you&apos;re wasting.
                        </span>
                    </div>

                    <img src="/assets/chart.png" height={673} width={800} className="landing-img" alt="A product demo showcasing the Pomelo time-tracking functionality." />
                </div>

                <hr className="hr-100" />

                <span className="landing-card-flex-title">
                    How much does it cost?
                </span>
                <div className="landing-card-flex">
                    <div className="landing-card-secondary">
                        <span className="landing-card-title-big">$10 / month</span>
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