var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1, $2, $3;
    var i, j;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                i = 0;
                __state = 1;
                return __continue;
            }
        case 1: {
                if (i < 3) {
                    j = 0;
                    __state = 3;
                    return __continue;
                } else {
                    console.log("done");
                    __state = -1;
                    __builder.ret();
                    break;
                }
            }
        case 3: {
                if (j < 3) {
                    if (i == 1 && j == 1) {
                        __state = 5;
                        return __continue;
                    } else {
                        $1 = "i = " + i + ", j = ";
                        __state = 7;
                        return __awaiter = Vow.fulfill(j);
                    }
                } else {
                    __state = 5;
                    return __continue;
                }
            }
        case 5: {
                i++;
                __state = 1;
                return __continue;
            }
        case 7: {
                $2 = __awaiter.valueOf();
                $3 = $1 + $2;
                console.log($3);
                __state = 8;
                return __continue;
            }
        case 8: {
                j++;
                __state = 3;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main();
