// reddit.com has already another content script inserted
// it also declares a DEBUG const.
// So, use another variable name
const DEBUG_reddit = false;
var functionCalled = false;

var makeAcestreamLinksClickable = function() {
    // acestream links are usually located inside CODE or BLOCKQUOTE tags
    let codeSegments = document.querySelectorAll("code, blockquote");

    let len = codeSegments.length;
    let codeSegment, codeSegmentText;
    let acestreamRegex = /(acestream:\/\/\w+)/g;
    let textWithClickableLink;

    for (let i=0; i<len; i++) {
        codeSegment = codeSegments[i];
        codeSegmentText = codeSegment.innerHTML;
        textWithClickableLink = codeSegmentText.replace(acestreamRegex, "<a href='$1'>$1</a>");

        logError(textWithClickableLink);

        let codeSegmentParent = codeSegment.parentElement;

        let codeElement = document.createElement("code");
        let segmentClassName = codeSegment.className;
        codeElement.className = segmentClassName;
        
        // contextualFragment created DOM nodes directly from string
        // It needs to be used because Mozilla doesn't like innerHTML assignment
        let codeFragment = document.createRange().createContextualFragment(textWithClickableLink);
        
        codeElement.appendChild(codeFragment);
        codeSegmentParent.replaceChild(codeElement, codeSegment);
    }
}


// Call the function after the page has fully Loaded
if (document.readyState === "loading") {
    // DOM is being loaded. Attach onload event listener
    document.addEventListener("DOMContentLoaded", makeAcestreamLinksClickable);
} else {
    // DOMContentLoaded already fired. Call function directly.
    if (functionCalled == false) {
        makeAcestreamLinksClickable();
        functionCalled = true;
    }
}


// Utility Function to display error
function logError(err) {
    // function to handle error during execution
    // firefox doesn't allow (or atleast discourages) console logging
    // in addons. So this is not really used in production
    if (DEBUG_reddit === true) {
        var stack = new Error().stack,
            caller = stack.split('\n')[1].split('@')[0];

        console.log(`[${caller}]`);
        console.log(`LOG=> ${err}`);
    }
}