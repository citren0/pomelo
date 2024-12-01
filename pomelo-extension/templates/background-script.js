
var previousURL = "";


const hoursDictionary = {
    "0": "12 AM",
    "1": "1 AM",
    "2": "2 AM",
    "3": "3 AM",
    "4": "4 AM",
    "5": "5 AM",
    "6": "6 AM",
    "7": "7 AM",
    "8": "8 AM",
    "9": "9 AM",
    "10": "10 AM",
    "11": "11 AM",
    "12": "12 PM",
    "13": "1 PM",
    "14": "2 PM",
    "15": "3 PM",
    "16": "4 PM",
    "17": "5 PM",
    "18": "6 PM",
    "19": "7 PM",
    "20": "8 PM",
    "21": "9 PM",
    "22": "10 PM",
    "23": "11 PM"
};

const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];


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

};


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


const newToken = async (runtime) =>
{
    const token = await getToken(runtime);

    const newTokenEndpoint = "https://api.pomeloprod.com:443/api/newtoken";

    try
    {
        fetch(newTokenEndpoint, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
        })
        .then((res) =>
        {
            res.json()
            .then((resJson) =>
            {
                // Don't set the token if we arent logged in. Even if token is set to "", the extension will redir from the login page.
                if (resJson.hasOwnProperty("token"))
                {
                    if (typeof chrome !== "undefined")
                    {
                        if (typeof browser !== "undefined")
                        {
                            // Firefox
                            browser.storage.local.set({ token: resJson.token ?? "" });
                        }
                        else
                        {
                            chrome.storage.local.set({ token: resJson.token ?? "" });
                        }

                    }

                }
                

            });

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
                (rule.stop >= currentTime.getHours()) &&
                (rule.days[weekday[(new Date()).getDay()]] == true))
            {
                // Rule broken! Send message to block.
                violated = true;

                const startFriendly = hoursDictionary[String(rule.start)];
                const stopFriendly = hoursDictionary[String(rule.stop)];

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


const startNewTokenIntervals = (runtime) =>
{
    const oneWeekms = (1000 * 60* 60 * 24 * 7);
    setTimeout(() => newToken(runtime), 1000);
    setInterval(() => newToken(runtime), oneWeekms);
};


// Setup.
if (typeof chrome !== "undefined")
{
    if (typeof browser !== "undefined")
    {
        // Firefox
        startNewTokenIntervals(browser);
        browser.tabs.onUpdated.addListener(getAndSetCurrentUrl);
        browser.tabs.onActivated.addListener(getAndSetCurrentUrl);
    }
    else
    {
        startNewTokenIntervals(chrome);
        chrome.tabs.onUpdated.addListener(getAndSetCurrentUrl);
        chrome.tabs.onActivated.addListener(getAndSetCurrentUrl);
    }
    
}
