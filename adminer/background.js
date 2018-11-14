let jobs_access_token = '';
let logs_access_token = '';

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        jobs_access_token = request.jobs_access_token;
        logs_access_token = request.logs_access_token;
    }
);

function responseListener(details) {
    const headers = details.requestHeaders;
    headers.push({
        name: 'jobs_access_token',
        value: jobs_access_token
    });
    headers.push({
        name: 'logs_access_token',
        value: logs_access_token
    });
    return {requestHeaders: details.requestHeaders};
}

chrome.webRequest.onBeforeSendHeaders.addListener(responseListener, {
    urls: ['*://*/*']
}, [
    'blocking',
    'requestHeaders'
]);

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: chrome.extension.getURL("settings.html")});
});
