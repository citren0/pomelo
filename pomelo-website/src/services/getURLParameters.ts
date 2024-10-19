
export const getURLParameter = (parameter: string) =>
{
    const href = window.location.href;
    const params = new URLSearchParams(href.substring(href.lastIndexOf("/") + 1, href.length));

    return params.get(parameter);
};