import Pages from "../../enums/Pages";
import { AppThunk } from "../store";
import { setCurrentPage } from "./slice";

const navigateTo = (page: Pages): AppThunk => async (dispatch, getState) =>
{
    dispatch(setCurrentPage(page));
}

export { navigateTo }