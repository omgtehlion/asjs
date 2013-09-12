var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");

var promiseMe = function(i) {
    return Vow.fulfill(i);
};

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1, $2, $3;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = 1;
                return promiseMe(1);
            }
        case 1: {
                $1 = __builder.val;
                __state = 2;
                return promiseMe(3);
            }
        case 2: {
                $2 = __builder.val;
                __state = 3;
                return promiseMe($2);
            }
        case 3: {
                $3 = __builder.val;
                console.log("main:", $1, 2, $3);
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main();
