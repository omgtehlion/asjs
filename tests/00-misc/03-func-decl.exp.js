var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1, $2, $3;
    var xxx;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                xxx = function () {
                    return 1;
                };
                __state = 1;
                return Vow.fulfill(0);
            }
        case 1: {
                $1 = __builder.val;
                $2 = xxx();
                $3 = yyy();
                console.log("main: ", $1, $2, $3);
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
    function yyy() {
        return 2;
    }
};

main();
