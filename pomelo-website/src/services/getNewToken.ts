
import config from "@/constants/config";
import { checkStatusCode } from "./checkStatusCode";


const getNewToken = () =>
{
    return new Promise<void>((resolve, reject) =>
    {
        fetch(config.getNewTokenURL, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.localStorage.getItem("token") ?? "",
            },
        })
        .then(async (getNewTokenResponse) =>
        {
            const getNewTokenResponseJson = await getNewTokenResponse.json();

            if (!checkStatusCode(getNewTokenResponse.status))
            {
                reject();
            }
            else
            {
                window.localStorage.setItem('token', getNewTokenResponseJson.token);

                resolve();
            }

        })
        .catch((_) =>
        {
            reject();
        });

    });

};

export default getNewToken;