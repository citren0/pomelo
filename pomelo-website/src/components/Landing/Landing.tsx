
import "./Landing.css";

const Landing = () =>
{
    return (
        <>
            <div className="landing-wrapper">
                <span className="landing-title">
                    Your own AI-powered productivity coach.&nbsp;
                </span>
                <span className="landing-subtitle">
                    Pomelo allows you to correct bad habits and waste less time online by keeping an eye on your browsing activity.
                </span>

                <div className="landing-images-flex">
                    <div className="landing-images-wrapper">
                        <img src="/assets/chat.png" height={450} width={535} className="landing-img" alt="A product demo showcasing the Pomelo chat functionality." />
                        <span className="landing-images-explanation">
                            Your personal assistant will recommend new productivity strategies and block time-wasting websites whenever it detects you're slacking.
                        </span>
                    </div>
                    <div className="landing-images-wrapper">
                        <img src="/assets/blocked.png" height={450} width={535} className="landing-img" alt="A product demo showcasing the website blocking functionality." />
                        <span className="landing-images-explanation">
                            When you violate a productivity block, Pomelo will let you know with an un-removable message, discouraging time-wasting behavior.
                        </span>
                    </div>
                </div>

                <a className="landing-conversion-button" href="/register">Get Started</a>

                <hr className="hr-100" />

                <span className="landing-card-flex-title">
                    How does Pomelo work?
                </span>
                <div className="landing-card-flex">
                    <div className="landing-card">
                        <span className="landing-card-title">Browser Extension</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Keeps an eye on your browsing habits while respecting your privacy.</span>
                    </div>
                    <div className="landing-card">
                        <span className="landing-card-title">AI-powered Insights</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Provides a personal productivity coach to help you be the best you.</span>
                    </div>
                    <div className="landing-card">
                        <span className="landing-card-title">Pomelo Dashboard</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Offers platform where you can make rules to block time-wasting websites.</span>
                    </div>
                </div>

                <span className="landing-card-flex-title">
                    Pomelo has one price for all users.
                </span>
                <div className="landing-card-flex">
                    <div className="landing-card-secondary">
                        <span className="landing-card-title-big">$10 / month</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Includes all features: Productivity assistant, browser extension, and rules-based website blocking.</span>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Landing;