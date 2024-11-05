import config from "@/constants/config";
import { checkStatusCode } from "./checkStatusCode";
import getNewToken from "./getNewToken";


const createOrder = (): Promise<any> =>
{
    return new Promise<any>((resolve, reject) =>
    {
        fetch(config.baseURL + config.createOrder,
        {
            method: "POST",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                cart:
                [
                    {
                        id: "1",
                        quantity: "1",
                    },
                ],
            }),

        })
        .then((response) => response.json())
        .then((responseJson) =>
        {
            console.log(responseJson);
            if (!checkStatusCode(responseJson.status))
            {
                reject(responseJson.message as Error);
            }
            return responseJson;
        })
        .then((order) =>
        {
            resolve(order.id);
        });

    });

};

const captureOrder = (data: any): Promise<void> =>
{
    return new Promise((resolve, reject) =>
    {
        fetch(config.baseURL + config.captureOrder,
        {
            method: "POST",
            headers:
            {
                "Authorization": "Bearer " + window.localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                subscriptionID: data.subscriptionID,
            }),

        })
        .then((response) => response.json())
        .then((responseJson) =>
        {
            console.log(responseJson);
            if (!checkStatusCode(responseJson.status))
            {
                reject(responseJson.message as Error);
            }
            getNewToken()
            .then((_) =>
            {
                window.location.href = "/ordersuccess";
                resolve(responseJson);
            })
            .catch((_) =>
            {
                resolve(responseJson);
            });

        })
        .then((order: any) =>
        {
            reject(order.id);
        });

    });

};


export { createOrder, captureOrder, };