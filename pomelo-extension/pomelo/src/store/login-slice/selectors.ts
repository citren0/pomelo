import { RootState } from '../store'

const selectUsername = (state: RootState) =>
    state.loginReducer.username;

const selectPassword = (state: RootState) =>
    state.loginReducer.password;

const selectJWT = (state: RootState) =>
    state.loginReducer.jwt;

const selectLoginThunkStatus = (state: RootState) =>
    state.loginReducer.loginSliceThunkStatuses.loginThunkStatus;

const loginSelectors =
{
    selectUsername,
    selectPassword,
    selectJWT,
    selectLoginThunkStatus,
};

export default loginSelectors