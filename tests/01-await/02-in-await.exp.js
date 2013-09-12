var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var promiseRec = function(i) {
    return Vow.fulfill(i);
};

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1, $2;
    var obj;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                obj = { x: Vow.fulfill(1) };
                __state = 1;
                return promiseRec(obj);
            }
        case 1: {
                $1 = __builder.val;
                __state = 2;
                return $1.x;
            }
        case 2: {
                $2 = __builder.val;
                console.log("main:", $2);
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
