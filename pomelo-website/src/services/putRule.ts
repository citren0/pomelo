import config from "@/constants/config";
import { checkStatusCode } from "./checkStatusCode";

const putRule = (domain: string, start: number, stop: number) =>
{
    return new Promise<void | string>((resolve, reject) =>
    {
        const putRuleURLWithQuery = config.baseURL + config.putRule + "?" + (new URLSearchParams(
        [
            ["domain", domain],
            ["start", String(start)],
            ["stop", String(stop)]
        ]));

        fetch(putRuleURLWithQuery, {
            method: "PUT",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
            }
        })
        .then(async (putRuleResponse) =>
        {
            const putRuleResponseJson = await putRuleResponse.json();

            if (!checkStatusCode(putRuleResponse.status))
            {
                reject(putRuleResponseJson.status);
            }
            else
            {
                resolve();
            }

        })
        .catch((_) =>
        {
            reject("Error encountered. Try again later.");
        });

    });

};

export default putRule;