function deferredXHR(url) {
    var deferred = new Deferred();
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    request.onload = function() {
        // call all callback's registered by deferred.then with 'request' as argument
        deferred.callback(request);
    };
    request.onerror = function() {
        // call all errbacks's registered by deferred.then with 'request' as argument
        deferred.errback(request);
    };
    return deferred;
}

var deferredLoadRedirectUrl = async(function(redirectUrl) {
    // redirectUrl contains another url
    var urlXHR = await(deferredXHR(redirectUrl));
    var url = urlXHR.responseText;

    var valueXHR = await(deferredXHR(url));
    // call all callback's registered by return value's 'then' with 'valueXHR.responseText' as argument
    return valueXHR.responseText;
});

// alert the value of the redirected url
deferredLoadRedirectUrl('http://lolcatz.com/redirect').then(function (value) { alert(value); });
