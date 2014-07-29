var urlRegex = /https?:\/\/github\.com\/(\w+)\/(\w+)\/issues(\??.*)/g;

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        url = details.url;

        username = url.replace(urlRegex, "$1");
        repository = url.replace(urlRegex, "$2");
        key = username + "/" + repository;

        // Replace with the saved URL if it exists.
        savedQuerystring = window.localStorage.getItem(key);
        if (savedQuerystring) {
            url = url + savedQuerystring;
            return { redirectUrl: url };
        }
        else {
            return {};
        }
    },
    {urls: ["*://*.github.com/*/*/issues"]},
    ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        url = details.url;

        username = url.replace(urlRegex, "$1");
        repository = url.replace(urlRegex, "$2");
        key = username + "/" + repository;

        pos = url.indexOf("?");
        querystring = url.substring(pos);
        window.localStorage.setItem(key, querystring);
    },
    {urls: ["*://*.github.com/*/*/issues?*"]},
    []
);

