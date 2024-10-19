import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { setUpApplication } from '../../store/app-slice/thunks'

const useAppSetup = () => {
    const appDispatch = useDispatch<AppDispatch>();

    const appSetup = () => {
        appDispatch(setUpApplication())
    };

    return {
        appSetup,
    }
};

export default useAppSetup