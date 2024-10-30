
const inject = (browserRuntime, message) =>
{
    document.getElementById("pomelo-insert")?.remove();

    if (message.type == "block")
    {
        fetch(browserRuntime.runtime.getURL('/warning.html'))
        .then(r => r.text())
        .then(html =>
        {
            document.body.insertAdjacentHTML('afterbegin', html);

            document.getElementById("warning-pomelo-image").src = browserRuntime.runtime.getURL("favicon.png");

            document.getElementById("warning-pomelo-text").innerText = message.message;
        });

    }

};


// Setup
if (typeof chrome !== "undefined")
{
    if (typeof browser !== "undefined")
    {
        browser.runtime.onMessage.addListener((message, sender, sendResponse) =>
        {
            inject(browser, message);
        });
    }
    else
    {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
        {
            inject(chrome, message);
        });
    }
    
}