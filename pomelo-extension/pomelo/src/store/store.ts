import { configureStore, combineReducers, Action } from '@reduxjs/toolkit';
import loginSlice from './login-slice/slice';
import { ThunkAction } from 'redux-thunk';
import configSlice from './config-slice/slice';

const rootReducer = combineReducers({
    loginReducer: loginSlice.reducer || {},
    configReducer: configSlice.reducer || {},
})

export const createStore = (rootReducer: RootReducer, preloadedState?: Partial<RootState>) =>
{
    return configureStore({
        reducer: rootReducer,
        devTools: false,
        preloadedState: preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            })
    });
    
}

const store = createStore(rootReducer);

export type RootReducer = typeof rootReducer;
export type RootState = ReturnType<RootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export type GetState = () => RootState;

export default store;