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

btnXhr.onclick = function (e) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1, $2;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = 1;
                return __continue;
            }
        case 1: {
                __state = 4;
                return deferredXhr("./README.md");
            }
        case 2: {
                var ex = __ex;
                text2.value = "ERROR: " + ex;
                if (/^file/.test(location.protocol))
                    text2.value += "\n\nPlease use a local server to test this example.\n" + "npm install http-server might be a good bet.";
                __state = 3;
                return __continue;
            }
        case 3: {
                __state = -1;
                __builder.ret();
                break;
            }
        case 4: {
                $1 = __builder.val;
                $2 = $1.responseText;
                text2.value = $2;
                __state = 3;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    }, function (ex) {
        var handler = [, 2, , , 2][__state];
        if (handler !== undefined) {
            __state = handler;
            __ex = ex;
            return __continue;
        }
    });
};

