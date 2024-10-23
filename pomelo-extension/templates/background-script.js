
var previousURL = "";


const getAndSetCurrentUrl = () =>
{
    var tabs;

    new Promise(async (resolve, reject) =>
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

    })
    .then((_) =>
    {
        const favicon = tabs[0].favIconUrl;
        const currentFullURL = tabs[0].url ?? "";
        const currentFullURLNoWWW = currentFullURL.replace("www.", "");
        const currentFullURLNoPort = currentFullURLNoWWW.replace(/:[0-9]+/, "");
        const isURL = currentFullURLNoPort.includes(".") &&
                     (currentFullURLNoPort.indexOf(".") != (currentFullURLNoPort.length - 1)) &&
                     (currentFullURLNoPort.indexOf(".") != 0);
    
        try
        {
            if (isURL && (typeof favicon !== "undefined"))
            {
                const domain = (new URL(currentFullURLNoPort)).host.toLocaleLowerCase();
    
                if (domain != previousURL)
                {
                    previousURL = domain;
                    postReport(domain, favicon);
                }
            }
    
        }
        catch (e)
        {
            return;
        }

    });

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
        browser.tabs.onUpdated.addListener(getAndSetCurrentUrl);
        browser.tabs.onActivated.addListener(getAndSetCurrentUrl);
    }
    else
    {
        chrome.tabs.onUpdated.addListener(getAndSetCurrentUrl);
        chrome.tabs.onActivated.addListener(getAndSetCurrentUrl);
    }
    
}
