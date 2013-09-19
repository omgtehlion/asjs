var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1;
    var p;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                p = [0, 1, 2].map(function (x) {
                    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
                    var $1;
                    return __builder.run(function () {
                        switch (__state) {
                        case 0: {
                                __state = 1;
                                return Vow.fulfill(x + 1);
                            }
                        case 1: {
                                $1 = __builder.val;
                                __state = -1;
                                __builder.ret($1);
                                break;
                            }
                        default:
                            throw 'Internal error: encountered wrong state';
                        }
                    });
                });
                __state = 1;
                return Vow.all(p);
            }
        case 1: {
                $1 = __builder.val;
                p = $1;
                console.log(p);
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

main();
