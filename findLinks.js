const DEBUG = false;

// a content script for finding acestream and magnet links from a webpage

// function definitions
// Acestream links
var acestream_from_text = function() {
	var allText = document.body.innerText;
	const acePattern = /\bacestream:\/\/\w+\b/g;
	var aceLinks = allText.match(acePattern) || [];
	//console.log(aceLinks);
	return aceLinks;
}
var acestream_from_anchor = function( ) {
	var anchors = document.getElementsByTagName("a");
	const len = anchors.length;
	var links = [];
	for (var i=0; i<len; i++) {
		if (anchors[i].href.startsWith("acestream://")) {
			links.push(anchors[i].href);
		}
	}
	//console.log(links);
	return links;
}
var acestream = function( ) {
	var textLinks = acestream_from_text();
	var anchorLinks = acestream_from_anchor();
	//console.log(textLinks);
	var uniqueLinks = new Set(textLinks.concat(anchorLinks));
	var links = Array.from(uniqueLinks);
	return links;
};

// Magnet links
var magnet_from_text = function() {
	var allText = document.body.innerText;
	const magnetPattern = /\bmagnet:\?.+\b/g;
	var magnetLinks = allText.match(magnetPattern) || [];
	//console.log(magnetLinks);
	return magnetLinks;
};
var magnet_from_anchor = function() {
	var anchors = document.getElementsByTagName("a");
	const len = anchors.length;
	var links = [];
	for (var i=0; i<len; i++) {
		//console.log(anchors[i].href);
		if (anchors[i].href.startsWith("magnet:?")) {
			links.push(anchors[i].href);
		}
	}
	//console.log(links);
	return links;
};
var magnet = function( ) {
	var textLinks = magnet_from_text();
	var anchorLinks = magnet_from_anchor();
	//console.log(textLinks);
	var uniqueLinks = new Set(textLinks.concat(anchorLinks));
	var links = Array.from(uniqueLinks);
	//console.log(links);
	return links;
};


// function to gather all links in object
var getLinks = function() {
	var acestreamLinks = acestream();
	var magnetLinks = magnet();
	//console.log(magnetLinks);
	var links = {
		"acestream": acestreamLinks,
		"magnet": magnetLinks
	}
	return links;
}
/*
  handler for receiving message
	PARAMS:
	message 		object
		the message sent by the sender
	sender 			sender object
	sendResponse	function
		a function to send a reply (as Promise) to the sender

*/
var messageHandler = function(message, sender, sendResponse) {
	logError(message.message);
	var links = getLinks();
	sendResponse({
		"links": links
	});
	return true;		// indicates that response will be sent by sendResponse
}

// attach handler to message onReceive event
browser.runtime.onMessage.addListener(messageHandler);


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