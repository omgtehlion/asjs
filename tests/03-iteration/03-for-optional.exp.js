var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1;
    var i;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                console.log("entering");
                i = 0;
                __state = 1;
                return __continue;
            }
        case 1: {
                __state = 2;
                return Vow.fulfill("i = " + i);
            }
        case 2: {
                $1 = __builder.val;
                console.log($1);
                if (i++ >= 4) {
                    console.log("exiting");
                    __state = -1;
                    __builder.ret();
                    break;
                } else {
                    __state = 4;
                    return __continue;
                }
            }
        case 4: {
                __state = 1;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

main();
