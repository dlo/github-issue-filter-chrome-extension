var urlRegex = /https?:\/\/github\.com\/(\w+)\/(\w+)\/issues(\??.*)/g;

function keyFromURL(url) {
    username = url.replace(urlRegex, "$1");
    repository = url.replace(urlRegex, "$2");
    return username + "/" + repository;
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        url = details.url;

        // Replace with the saved URL if it exists.
        savedQuerystring = window.localStorage.getItem(keyFromURL(url));
        if (savedQuerystring) {
            url = "https://github.com/" + keyFromURL(url) + "/issues" + savedQuerystring
            return { redirectUrl: url };
        }
        else {
            return {};
        }
    },
    {urls: [
        "*://*.github.com/*/*/issues",
        "*://*.github.com/*/*/issues?_pjax=*"
    ]},
    ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        url = details.url;

        pos = url.indexOf("?");
        querystring = url.substring(pos);
        window.localStorage.setItem(keyFromURL(url), querystring);
        return {}
    },
    {urls: ["*://*.github.com/*/*/issues?q=*"]},
    []
);

