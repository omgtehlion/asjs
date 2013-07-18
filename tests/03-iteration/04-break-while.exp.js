var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function (x) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1, $2, $3, $4;
    var i;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                i = 0;
                __state = 1;
                return __continue;
            }
        case 1: {
                if (i < 6) {
                    if (i == 3) {
                        __state = 3;
                        return __continue;
                    } else {
                        __state = 8;
                        return __continue;
                    }
                } else {
                    __state = 3;
                    return __continue;
                }
            }
        case 3: {
                console.log("done1");
                i = 0;
                __state = 4;
                return __continue;
            }
        case 4: {
                if (i > 2) {
                    __state = 5;
                    return __continue;
                } else {
                    __state = 6;
                    return __continue;
                }
            }
        case 5: {
                console.log("done2");
                __state = -1;
                __builder.ret();
                break;
            }
        case 6: {
                __state = 7;
                return __awaiter = Vow.fulfill(i);
            }
        case 7: {
                $1 = __awaiter.valueOf();
                $2 = "i = " + $1;
                console.log($2);
                i++;
                if (i <= 5) {
                    __state = 4;
                    return __continue;
                } else {
                    __state = 5;
                    return __continue;
                }
            }
        case 8: {
                i += 1;
                __state = 9;
                return __awaiter = Vow.fulfill(i);
            }
        case 9: {
                $3 = __awaiter.valueOf();
                $4 = "i = " + $3;
                console.log($4);
                __state = 1;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main();
