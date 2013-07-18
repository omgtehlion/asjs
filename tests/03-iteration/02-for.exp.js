var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1, $2;
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
                if (i < 5) {
                    __state = 3;
                    return __awaiter = Vow.fulfill("i = " + i);
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
                __state = 4;
                return __awaiter = Vow.fulfill(i + 1);
            }
        case 4: {
                $2 = __awaiter.valueOf();
                i = $2;
                __state = 1;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main();
