var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var thisShouldBeCalled = function(x) {
    console.log("thisShouldBeCalled");
    return Vow.fulfill(x);
};

var thisShouldnt = function(x) {
    console.error("ERROR: thisShouldnt");
    return Vow.fulfill(x);
};

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1, $2, $3, $4, $5;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                $1 = 0;
                if ($1) {
                    __state = 1;
                    return __continue;
                } else {
                    __state = 16;
                    return thisShouldBeCalled(1);
                }
            }
        case 1: {
                console.log($1);
                $2 = 1;
                if ($2) {
                    __state = 3;
                    return thisShouldBeCalled(2);
                } else {
                    __state = 4;
                    return __continue;
                }
            }
        case 3: {
                $2 = __builder.val;
                __state = 4;
                return __continue;
            }
        case 4: {
                console.log($2);
                $3 = 1;
                if ($3) {
                    __state = 5;
                    return __continue;
                } else {
                    __state = 14;
                    return thisShouldnt(3);
                }
            }
        case 5: {
                $4 = 0;
                if ($4) {
                    __state = 7;
                    return thisShouldnt(4);
                } else {
                    __state = 8;
                    return __continue;
                }
            }
        case 7: {
                $4 = __builder.val;
                __state = 8;
                return __continue;
            }
        case 8: {
                __state = 9;
                return thisShouldBeCalled(5);
            }
        case 9: {
                $5 = __builder.val;
                if ($5) {
                    __state = 10;
                    return __continue;
                } else {
                    __state = 12;
                    return thisShouldnt(6);
                }
            }
        case 10: {
                __state = -1;
                __builder.ret();
                break;
            }
        case 12: {
                $5 = __builder.val;
                __state = 10;
                return __continue;
            }
        case 14: {
                $3 = __builder.val;
                __state = 5;
                return __continue;
            }
        case 16: {
                $1 = __builder.val;
                __state = 1;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

main();
