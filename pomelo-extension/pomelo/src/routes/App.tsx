import { useEffect } from 'react';
import useAppSetup from '../services/hooks/useAppSetup';
import { useSelector } from 'react-redux';
import Home from './Home/Home';
import Login from './Login/Login';
import "./App.css";
import "./Fonts.css";
import configSelectors from '../store/config-slice/selector';
import Pages from '../enums/Pages';
import Welcome from './Welcome/Welcome';


const App = () =>
{
    const { appSetup } = useAppSetup();

    const currentPage = useSelector(configSelectors.selectCurrentPage);

    useEffect(() =>
    {
        appSetup();
    }, []);

    return (
        <>
            <div className='content-layout'>
                <hr className='w-100'/>
                
                { currentPage == Pages.Login && <Login /> }
                { currentPage == Pages.Home && <Home /> }
                { currentPage == Pages.Welcome && <Welcome /> }
            </div>
        </>
    );
}

export default App;