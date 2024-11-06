
import "./Landing.css";

const Landing = () =>
{
    return (
        <>
            <div className="landing-wrapper">
                <span className="landing-title">
                    Your AI-powered productivity coach.
                </span>
                <span className="landing-subtitle">
                    Pomelo keeps an eye on your browsing, allowing you to correct bad habits and waste less time online.
                </span>

                <a className="landing-conversion-button" href="/register">Get Started</a>

                <hr className="hr-100" />

                <span className="landing-card-flex-title">
                    How does Pomelo work?
                </span>
                <div className="landing-card-flex">
                    <div className="landing-card">
                        <span className="landing-card-title">Browser Extension</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Keeps track of your browser activity and blocks time-wasters while respecting your privacy.</span>
                    </div>
                    <div className="landing-card">
                        <span className="landing-card-title">AI-powered Insights</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Provides a personal productivity coach to help you be the best you.</span>
                    </div>
                    <div className="landing-card">
                        <span className="landing-card-title">Pomelo Dashboard</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Combines the data and insights into one platform for you.</span>
                    </div>
                </div>

                <span className="landing-card-flex-title">
                    Pomelo has one price for all users.
                </span>
                <div className="landing-card-flex">
                    <div className="landing-card-secondary">
                        <span className="landing-card-title">$10</span>
                        <hr className="hr-100" />
                        <span className="landing-card-text">Includes all features: Productivity assistant, browser extension, and strategies.</span>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Landing;