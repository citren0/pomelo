
const getAndSetCurrentUrl = async () =>
{
    var tabs;

    await new Promise(async (resolve, reject) =>
    {
        if (typeof chrome !== "undefined")
        {
            if (typeof browser !== "undefined")
            {
                // Firefox
                tabs = await browser.tabs.query({ currentWindow: true, active: true });
                resolve();
            }
            else
            {
                tabs = await chrome.tabs.query({ currentWindow: true, active: true })
                resolve();
            }
            
        }

    });

    const favicon = await tabs[0].favIconUrl;
    const currentFullURL = await tabs[0].url ?? "";
    const currentFullURLNoWWW = await currentFullURL.replace("www.", "");
    const currentFullURLNoPort = await currentFullURLNoWWW.replace(/:[0-9]+/, "");
    const isURL = await currentFullURLNoPort.includes(".") &&
                        (currentFullURLNoPort.indexOf(".") != (currentFullURLNoPort.length - 1)) &&
                        (currentFullURLNoPort.indexOf(".") != 0);

    try
    {
        if (isURL)
        {
            const domain = (new URL(currentFullURLNoPort)).host.toLocaleLowerCase();
            postReport(domain, favicon);
        }

    }
    catch (e)
    {
        return;
    }

}


const postReport = async (url, favicon) =>
{
    var token = "";

    await new Promise((resolve, reject) =>
    {
        if (typeof chrome !== "undefined")
        {
            if (typeof browser !== "undefined")
            {
                // Firefox
                browser.storage.local.get([ "token" ]).then((tokenObj) =>
                {
                    if (tokenObj.hasOwnProperty("token"))
                    {
                        token = tokenObj.token;
                    }
                    resolve();
                });

            }
            else
            {
                chrome.storage.local.get([ "token" ]).then((tokenObj) =>
                {
                    if (tokenObj.hasOwnProperty("token"))
                    {
                        token = tokenObj.token;
                    }
                    resolve();
                });

            }
            
        }
    });

    const postReportEndpoint = "http://localhost:3080/api/report";

    try
    {
        const postReportResponse = await fetch(postReportEndpoint, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                domain: url,
                favicon: favicon,
            }),
        });
        
    }
    catch (e)
    {
        console.log("Failed to post report.");
    }
};


// Setup.
if (typeof chrome !== "undefined")
{
    if (typeof browser !== "undefined")
    {
        // Firefox
        browser.tabs.onActivated.addListener(getAndSetCurrentUrl);
    }
    else
    {
        chrome.tabs.onActivated.addListener(getAndSetCurrentUrl);
    }
    
}
