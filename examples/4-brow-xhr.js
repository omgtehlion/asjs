function deferredXhr(url) {
    var promise = Vow.promise();
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = function() { promise.fulfill(request); };
    request.onerror = function() { promise.reject(request.statusText); };
    request.send();
    return promise;
}

var btn = document.getElementById("btn-xhr");
var textarea = document.getElementById("text-2");

btn.onclick = async(function(e) {
    try {
        textarea.value = await(deferredXhr("./README.md")).responseText;
    } catch(ex) {
        textarea.value = "ERROR: " + ex;
        if (/^file/.test(location.protocol))
            textarea.value += "\n\nPlease use a local server to test this example.\n" +
                "npm install http-server might be a good bet.";
    }
});
