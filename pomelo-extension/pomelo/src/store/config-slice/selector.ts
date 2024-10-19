
import { RootState } from '../store'


const selectCurrentPage = (state: RootState) =>
    state.configReducer.currentPage;

const configSelectors =
{
    selectCurrentPage,
};

export default configSelectors;