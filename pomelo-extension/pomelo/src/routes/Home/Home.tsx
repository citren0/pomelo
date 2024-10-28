
import { useDispatch } from "react-redux";
import pomelo_logo from "../../../assets/favicon.png";
import './Home.css';
import { AppDispatch } from "../../store/store";
import { logout } from "../../store/login-slice/thunks";

const Home = () =>
{
    const dispatch = useDispatch<AppDispatch>();

    return (
        <>
            <div className="home-wrapper">
                <img src={pomelo_logo} height={64} width={64} alt={"Pomelo logo."} />
                <div className="home-text">
                    Pomelo is running and active.
                </div>
                <div className="home-text">
                    Check the website <a className="home-text" href="https://pomeloprod.com/" target="_blank">pomeloprod.com</a> for productivity insights.
                </div>
                <button
                    className="nav-button-red m-top-2"
                    onClick={() => dispatch(logout())}
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default Home;