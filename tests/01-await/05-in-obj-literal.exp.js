var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1, $2;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = 1;
                return Vow.fulfill(1);
            }
        case 1: {
                $1 = __builder.val;
                __state = 2;
                return Vow.fulfill(3);
            }
        case 2: {
                $2 = __builder.val;
                console.log("main", {
                    "a": $1,
                    "b": 2,
                    "c": $2
                });
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};
main();
