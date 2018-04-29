browser.contextMenus.create({
    id: "open-link",
    title: "Open Link with Sodaplayer",
    contexts: ["link"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "open-link") {
        console.log(info.linkUrl);
        const uri = "sodaplayer://?url=" + info.linkUrl;
        //window.open(uri);
        location.href = uri;
    }
});