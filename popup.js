function getLinkTitle(linkUrl) {
    if (linkUrl.startsWith("acestream://")) {
        return linkUrl;
    }
    else if (linkUrl.startsWith("magnet:?")) {
        var titleRegex = /&dn=([^&|\b]*)/;
        var titleArray = titleRegex.exec(linkUrl);
        console.log(titleArray);
        if (titleArray.length == 2) {
            var title = decodeURIComponent(titleArray[1]);
            console.log(title);
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
    console.log(message.target);
    if (message.target === "popup") {
        var links = message.message.links;
        displayLinks(links);
    }
}


function onError(error) {
    console.error(`Error: ${error}`);
}
function onSucces(param) {
    console.log("Sent Message to Background Script");
}
 
var sending = function sendMessageToTabs( ) {
    //console.log("sending message to background script");
    browser.runtime.sendMessage({
        "target": "background",
        "message": "getlinks"
    }).then(onSucces, onError);
}
sending();


browser.runtime.onMessage.addListener(handleLinks);