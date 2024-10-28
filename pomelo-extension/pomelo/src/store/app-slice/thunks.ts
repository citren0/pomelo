
import Pages from "../../enums/Pages";
import { navigateTo } from "../config-slice/thunks";
import { setJWT } from "../login-slice/slice";
import { AppThunk } from "../store";


const setUpApplication = (): AppThunk => async (dispatch, getState) =>
{
    const onResolution = (token: any) =>
    {
        if (token.hasOwnProperty("token"))
        {
            // Logged in.
            dispatch(setJWT(token.token ?? ""))
            dispatch(navigateTo(Pages.Home));
        }
        else
        {
            // Not logged in.
            dispatch(navigateTo(Pages.Welcome));
        }
    };
    
    if (typeof chrome !== "undefined")
    {
        if (typeof browser !== "undefined")
        {
            // Firefox
            browser.storage.local.get([ "token" ]).then(onResolution);
        }
        else
        {
            chrome.storage.local.get([ "token" ]).then(onResolution);
        }
        
    }

    return true;
};

export { setUpApplication, };