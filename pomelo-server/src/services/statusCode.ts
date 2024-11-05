
export const checkStatusCode = (code: number) =>
{
    switch (code)
    {
        case 200:
            return true;
        case 201:
            return true;
        case 204:
            return true;
        case 304:
            return true;
        default:
            return false;
    }
};