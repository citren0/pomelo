
var previousURL = "";


const getAndSetCurrentUrl = () =>
{
    var tabs;
    var runtime;

    new Promise(async (resolve, reject) =>
    {
        if (typeof chrome !== "undefined")
        {
            if (typeof browser !== "undefined")
            {
                // Firefox
                tabs = await browser.tabs.query({ currentWindow: true, active: true });
                runtime = browser;
                resolve();
            }
            else
            {
                tabs = await chrome.tabs.query({ currentWindow: true, active: true });
                runtime = chrome;
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
        const isURL = (currentFullURLNoPort.includes(".")) &&
                      (currentFullURLNoPort.indexOf(".") != (currentFullURLNoPort.length - 1)) &&
                      (currentFullURLNoPort.indexOf(".") != 0);    

        if ((isURL == true) &&
            (typeof favicon !== "undefined"))
        {
            const domain = (new URL(currentFullURLNoPort)).host.toLocaleLowerCase();

            // Check the rules on all tab changes.
            checkRules(domain, runtime);

            // Do report if url has changed.
            if (domain != previousURL)
            {
                previousURL = domain;

                postReport(domain, favicon, runtime);
            }
            
        }

    });

}


const getToken = async (runtime) =>
{
    var token = "";

    await new Promise((resolve, reject) =>
    {
        runtime.storage.local.get([ "token" ]).then((tokenObj) =>
        {
            if (tokenObj.hasOwnProperty("token"))
            {
                token = tokenObj.token;
            }
            resolve();
        });

    });

    return token;
};


const postReport = async (url, favicon, runtime) =>
{
    const token = await getToken(runtime);

    const postReportEndpoint = "https://api.pomeloprod.com:443/api/report";

    try
    {
        const _ = await fetch(postReportEndpoint, {
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


const checkRules = async (domain, runtime) =>
{
    // Get auth token.
    const token = await getToken(runtime);

    // Get rules.
    const getRulesEndpoint = "https://api.pomeloprod.com:443/api/rules";
    fetch(getRulesEndpoint, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
        },
    })
    .then(async (getRulesResponse) => await getRulesResponse.json())
    .then((getRulesResponseJson) =>
    {
        const rules = getRulesResponseJson.rules ?? [];

        const currentTime = new Date();

        // Check for broken rules.
        var violated = false;

        rules.forEach((rule) =>
        {
            if ((rule.domain == domain) &&
                (rule.start <= currentTime.getHours()) &&
                (rule.stop >= currentTime.getHours()))
            {
                // Rule broken! Send message to block.
                violated = true;

                const startFriendly = `${((rule.start + 1) > 12) ? (rule.start + 1 - 12) : (rule.start + 1)}${(rule.start < 11 || rule.start == 23) ? "AM" : "PM"}`;
                const stopFriendly = `${((rule.stop + 1) > 12) ? (rule.stop + 1 - 12) : (rule.stop + 1)}${(rule.stop < 11 || rule.stop == 23) ? "AM" : "PM"}`;
                const message = `Block ${domain} from ${startFriendly} to ${stopFriendly}.`;

                const query = { active: true, currentWindow: true };
                runtime.tabs.query(query, (tabs) =>
                {
                    runtime.tabs.sendMessage(tabs[0].id, { type: "block", message: message });
                });
        
            }

        });

        if (violated == false)
        {
            // Send message to unblock. Website may have been previously blocked and now unblocked.
            const query = { active: true, currentWindow: true };
            runtime.tabs.query(query, (tabs) =>
            {
                runtime.tabs.sendMessage(tabs[0].id, { type: "unblock", message: "" });
            });

        }

    })
    .catch((_) => {});

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
