
import { LoginRequest, LoginResponse } from "../../interfaces/login";
import Pages from "../../enums/Pages";
import { checkStatusCode } from "../../services/helpers/statusCode";
import { navigateTo } from "../config-slice/thunks";
import { AppThunk } from "../store";
import loginSelectors from "./selectors";
import { setJWT, setLoginThunkStatus, setPassword, setUsername } from "./slice";
import AsyncThunkStatus from "../../enums/AsyncThunkStatus";
import config from "../../constants/config";


const clearCredentials = (): AppThunk => async (dispatch, getState) =>
{
    dispatch(setUsername(""));
    dispatch(setPassword(""));
}


const clearJWTFromStore = (): AppThunk => async (dispatch, getState) =>
{
    dispatch(setJWT(undefined));
}


const clearJWTFromLocalStorage = (): AppThunk => async (dispatch, getState) =>
{
    if (typeof chrome !== "undefined")
    {
        if (typeof browser !== "undefined")
        {
            // Firefox
            browser.storage.local.set({ key: null });
        }
        else
        {
            chrome.storage.local.set({ key: null });
        }        
    }
}


const login = (): AppThunk => async (dispatch, getState) =>
{
    dispatch(setLoginThunkStatus({ thunkStatus: AsyncThunkStatus.Pending, }));

    const state = getState();

    const username = loginSelectors.selectUsername(state);
    const password = loginSelectors.selectPassword(state);

    const loginEndpoint = config.baseURL + config.login;

    const loginRequestBody: LoginRequest = {
        username: username,
        password: password,
    };

    try
    {
        const loginResponse = await fetch(loginEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginRequestBody),
        });

        const loginResponseJson: LoginResponse = await loginResponse.json();

        if (!checkStatusCode(loginResponse.status))
        {
            dispatch(navigateTo(Pages.Login));
            dispatch(setLoginThunkStatus({ thunkStatus: AsyncThunkStatus.Error, message: loginResponseJson.status, }));
        }
        else
        {
            const jwt = loginResponseJson.token;

            // Store jwt in redux store.
            dispatch(setJWT(jwt ?? ""));

            // Using this on startup to continue the session.
            if (typeof chrome !== "undefined")
            {
                if (typeof browser !== "undefined")
                {
                    // Firefox
                    browser.storage.local.set({ token: jwt ?? "" });
                }
                else
                {
                    chrome.storage.local.set({ token: jwt ?? "" });
                }        
            }

            if ((jwt ?? "") != "")
            {
                dispatch(clearCredentials());
                dispatch(setLoginThunkStatus({ thunkStatus: AsyncThunkStatus.Success, }));
                dispatch(navigateTo(Pages.Home));
            }
            else
            {
                dispatch(setLoginThunkStatus({ thunkStatus: AsyncThunkStatus.Error, message: "Failed to log in. Try again later.", }));
            }

        }
        
    }
    catch (e)
    {
        dispatch(setLoginThunkStatus({ thunkStatus: AsyncThunkStatus.Error, message: "Failed to log in. Try again later.", }));
    }
    
};


const getTokenFromStorage = (): AppThunk => async (dispatch, getState) =>
{
    if (typeof chrome !== "undefined")
    {
        if (typeof browser !== "undefined")
        {
            // Firefox
            browser.storage.local.get("token" )
            .then((jwt: string) =>
            {
                dispatch(setJWT(jwt));
            });

        }
        else
        {
            chrome.storage.local.get("token")
            .then((jwt: string) =>
            {
                dispatch(setJWT(jwt));
            });

        }

    }

};


const logout = (): AppThunk => async (dispatch, getState) =>
{
    dispatch(clearJWTFromStore());
    dispatch(clearJWTFromLocalStorage());
    dispatch(navigateTo(Pages.Login));
};


export { login, clearCredentials, clearJWTFromStore, getTokenFromStorage, logout, };