var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                console.log("hello!");
                __state = 1;
                return Vow.fulfill(0);
            }
        case 1: {
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
