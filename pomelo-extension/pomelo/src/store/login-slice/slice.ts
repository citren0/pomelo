import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'
import ThunkStatusAndMessage from '../../interfaces/thunkStatusAndMessage';
import AsyncThunkStatus from '../../enums/AsyncThunkStatus';

interface LoginSliceThunkStatuses
{
    loginThunkStatus: ThunkStatusAndMessage;
};

export interface LoginState
{
    username?: string;
    password?: string;
    jwt?: string;
    loginSliceThunkStatuses: LoginSliceThunkStatuses;
};

const initialState: LoginState =
{
    username: undefined,
    password: undefined,
    jwt: undefined,
    loginSliceThunkStatuses:
    {
        loginThunkStatus:
        {
            thunkStatus: AsyncThunkStatus.Idle,
        },
    },
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers:
    {
        setUsername(state: LoginState, action: PayloadAction<string>)
        {
            state.username = action.payload;
        },
        setPassword(state: LoginState, action: PayloadAction<string>)
        {
            state.password = action.payload;
        },
        setJWT(state: LoginState, action: PayloadAction<string | undefined>)
        {
            state.jwt = action.payload;
        },
        setLoginThunkStatus(state: LoginState, action: PayloadAction<ThunkStatusAndMessage>)
        {
            state.loginSliceThunkStatuses.loginThunkStatus = action.payload;
        },
    }
});

export const { setUsername, setPassword, setJWT, setLoginThunkStatus, } = loginSlice.actions;

export default loginSlice;