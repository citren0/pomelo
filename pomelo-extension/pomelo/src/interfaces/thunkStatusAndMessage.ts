import AsyncThunkStatus from "../enums/AsyncThunkStatus"

export default interface ThunkStatusAndMessage
{
    thunkStatus: AsyncThunkStatus;
    message?: string;
}