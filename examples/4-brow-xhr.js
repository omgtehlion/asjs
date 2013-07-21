function deferredXhr(url) {
    var promise = Vow.promise();
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.onload = function() { promise.fulfill(request); };
    request.onerror = function() { promise.reject(request.statusText); };
    request.send();
    return promise;
}

var btnXhr = document.getElementById("btn-xhr");
var text2 = document.getElementById("text-2");

btnXhr.onclick = async(function(e) {
    try {
        text2.value = await(deferredXhr("./README.md")).responseText;
    } catch(ex) {
        text2.value = "ERROR: " + ex;
        if (/^file/.test(location.protocol))
            text2.value += "\n\nPlease use a local server to test this example.\n" +
                "npm install http-server might be a good bet.";
    }
});
