var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1, $2, $3, $4, $5, $6, $7, $8, $9;
    var promisedFunc, promisedArray, arr;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                promisedFunc = Vow.fulfill(function (s) {
                    console.log(s);
                });
                __state = 1;
                return __awaiter = promisedFunc;
            }
        case 1: {
                $1 = __awaiter.valueOf();
                $1("hello!");
                promisedArray = Vow.fulfill([0, 1, 2]);
                __state = 2;
                return __awaiter = promisedArray;
            }
        case 2: {
                $2 = __awaiter.valueOf();
                $3 = function (x) {
                    return x + 1;
                };
                $4 = $2.map($3);
                arr = $4;
                console.log(arr.join(", "));
                __state = 3;
                return __awaiter = promisedArray;
            }
        case 3: {
                $5 = __awaiter.valueOf();
                $6 = "ma" + "p";
                $7 = function (x) {
                    return x + 1;
                };
                $8 = $5[$6]($7);
                arr = $8;
                console.log(arr.join(", "));
                __state = 4;
                return __awaiter = Vow.fulfill("log");
            }
        case 4: {
                $9 = __awaiter.valueOf();
                console[$9]("bye!");
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
