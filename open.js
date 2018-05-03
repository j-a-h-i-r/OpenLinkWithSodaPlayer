const DEBUG = false;

browser.contextMenus.create({
    id: "open-link",
    title: "Play Link with Sodaplayer",
    contexts: ["link", "selection"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "open-link") {
        const link = info.selectionText || info.linkUrl;
        const uri = "sodaplayer://?url=" + link;
        location.href = uri;
        logError(uri);
    }
});


// Utility Functions for message communication
function onSucces(param) {
    logError("Sent Message to Content Script");
    logError(param);

    // got links from content script
    // send them to popup
    browser.runtime.sendMessage({
        "target": "popup",
        "message": param
    });
}

var sendMessageToContentScript = function(tabs) {
    //console.log("tabs", tabs);
    logError("Sending message to content script");

    browser.tabs.sendMessage(tabs[0].id, {
        "message": "givelink"
    }).then(onSucces, logError);
}

var handleMessage = function(message, sender, sendResponse) {
    var msg = message.message;
    logError("message:", msg);
    if (message.target == "background") {
        // get links from content script
        //console.log("Insctruction: get links");
        browser.tabs.query({
            currentWindow: true, active: true
        }).then(sendMessageToContentScript).catch(logError);
    }
}

browser.runtime.onMessage.addListener(handleMessage);



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