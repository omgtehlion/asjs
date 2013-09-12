var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1;
    var i, j;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                console.log("entering");
                for (i = 0, j = 10; i < 5; i++)
                    console.log("i = " + i + ", j = " + j);
                __state = 1;
                return Vow.fulfill("exiting");
            }
        case 1: {
                $1 = __builder.val;
                console.log($1);
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
