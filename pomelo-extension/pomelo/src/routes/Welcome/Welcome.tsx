
import { useDispatch } from "react-redux";
import Pages from "../../enums/Pages";
import { navigateTo } from "../../store/config-slice/thunks";
import "./Welcome.css";
import { AppDispatch } from "../../store/store";
import pomelo_logo from "../../../assets/favicon.png";

const Welcome = () =>
{
    const dispatch = useDispatch<AppDispatch>();

    return (
        <>
            <div className="welcome-wrapper">
                <div className="pomelo-logo-wrapper">
                    <img src={pomelo_logo} height={64} width={64} alt={"Pomelo Logo"} />
                    <span className="pomelo-logo-text">Pomelo Productivity</span>
                </div>

                <span className="welcome-text">
                    Pomelo will help you learn about your browser usage and productivity.
                </span>

                <span className="welcome-text-second">
                    We respect your privacy by <span className="welcome-text-second-em">only</span> keeping track of website domains you view (ex. google.com) and when you visit them.
                </span>

                <button
                    onClick={() => dispatch(navigateTo(Pages.Login))}
                    className="nav-button-big-continue"
                >
                    Continue
                </button>
            </div>
        </>
    )
};

export default Welcome;