
import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'
import Pages from '../../enums/Pages';


export interface ConfigState
{
    currentPage: Pages;
};

const initialState: ConfigState = {
    currentPage: Pages.Login,
};

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers:
    {
        setCurrentPage(state: ConfigState, action: PayloadAction<Pages>)
        {
            state.currentPage = action.payload;
        },
    }
});

export const { setCurrentPage, } = configSlice.actions;

export default configSlice;