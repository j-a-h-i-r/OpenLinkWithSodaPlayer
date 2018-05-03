const DEBUG = false;

function getLinkTitle(linkUrl) {
    if (linkUrl.startsWith("acestream://")) {
        return linkUrl;
    }
    else if (linkUrl.startsWith("magnet:?")) {
        var titleRegex = /&dn=([^&|\b]*)/;
        var titleArray = titleRegex.exec(linkUrl);
        logError(titleArray);
        if (titleArray.length == 2) {
            var title = decodeURIComponent(titleArray[1]);
            logError(title);
            return title;
        }
        else {
            return linkUrl;
        }
    }
}


var displayLinks = function(links) {
    for(var linkType in links) {
        var divElem = document.getElementById(linkType);

        for(var link in links[linkType]) {
            var fullLink = links[linkType][link];
            var linkTitle = getLinkTitle(fullLink);
            var node = document.createElement("a");
            var textNode = document.createTextNode(linkTitle.substring(0, 100));
            node.appendChild(textNode);
            node.href = "sodaplayer://?url=" + fullLink;
            node.className = "link";
            divElem.appendChild(node);
        }
    }
}

var handleLinks = function(message, sender, sendResponse) {
    logError(message.target);
    if (message.target === "popup") {
        var links = message.message.links;
        displayLinks(links);
    }
}


// Utitlity function for message Passing
function onSucces(param) {
    logError("Sent Message to Background Script");
}
 
var sending = function sendMessageToTabs( ) {
    //console.log("sending message to background script");
    browser.runtime.sendMessage({
        "target": "background",
        "message": "getlinks"
    }).then(onSucces, logError);
}
sending();


browser.runtime.onMessage.addListener(handleLinks);

// Utility Function to display error
function logError(err) {
    // function to handle error during execution
    // firefox doesn't allow (or atleast discourages) console logging
    // in addons. So this is not really used in production
    if (DEBUG === true) {
        var stack = new Error().stack,
            caller = stack.split('\n')[1].split('@')[0];

        console.log(`[${caller}]`);
        console.log(`LOG=> ${err}`);
    }
}