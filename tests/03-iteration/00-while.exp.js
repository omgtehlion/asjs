var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var i = 0;
var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                console.log("entering, i=" + i);
                __state = 1;
                return __continue;
            }
        case 1: {
                if (i < 3) {
                    __state = 3;
                    return __awaiter = Vow.fulfill("i < 3");
                } else {
                    console.log("exiting");
                    __state = -1;
                    __builder.ret();
                    break;
                }
            }
        case 3: {
                $1 = __awaiter.valueOf();
                console.log($1);
                i++;
                __state = 1;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main();
