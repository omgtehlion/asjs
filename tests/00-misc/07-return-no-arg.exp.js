var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function (i) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

var main2 = function (i) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main("promised").then(function(x) {
    console.log(typeof(x));
});
