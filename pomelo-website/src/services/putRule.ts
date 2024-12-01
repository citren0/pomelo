import config from "@/constants/config";
import { checkStatusCode } from "./checkStatusCode";
import DaysOfTheWeek from "@/interfaces/DaysOfTheWeek";

const putRule = (domain: string, start: number, stop: number, daysOfWeek: DaysOfTheWeek) =>
{
    return new Promise<void | string>((resolve, reject) =>
    {
        const putRuleURLWithQuery = config.baseURL + config.putRule + "?" + (new URLSearchParams(
        [
            ["domain", domain],
            ["start", String(start)],
            ["stop", String(stop)],
            ["days", encodeURIComponent(JSON.stringify(daysOfWeek))]
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
        .catch(() =>
        {
            reject("Error encountered. Try again later.");
        });

    });

};

export default putRule;