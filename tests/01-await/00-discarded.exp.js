var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var promiseMe = function(i) {
    var promise = Vow.promise();
    setTimeout(function() {
        console.log("promised " + i);
        promise.fulfill("promised " + i);
    }, 10);
    return promise;
};

var main = function (i) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = 1;
                return promiseMe(i);
            }
        case 1: {
                console.log("exiting");
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

main(1);
