var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function (x, y) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                console.log("entering, y=" + y);
                $1 = x = y;
                if ($1 === 0) {
                    __state = 1;
                    return __continue;
                } else if ($1 === 1) {
                    __state = 3;
                    return __continue;
                } else if ($1 === 2) {
                    __state = 5;
                    return __continue;
                } else if ($1 === 3) {
                    __state = 6;
                    return __continue;
                } else if ($1 === 4) {
                    __state = 11;
                    return __continue;
                } else {
                    __state = 12;
                    return __continue;
                }
            }
        case 1: {
                console.log("x == 0, maybe");
                __state = -1;
                __builder.ret(0);
                break;
            }
        case 3: {
                __state = 4;
                return __awaiter = Vow.delay(0, 1);
            }
        case 4: {
                console.log("x == 1");
                __state = 5;
                return __continue;
            }
        case 5: {
                __state = 6;
                return __continue;
            }
        case 6: {
                console.log("x is 1 or 2 or 3");
                __state = 7;
                return __continue;
            }
        case 7: {
                console.log("exiting");
                __state = -1;
                __builder.ret();
                break;
            }
        case 11: {
                console.log("x is 4");
                __state = 7;
                return __continue;
            }
        case 12: {
                __state = 13;
                return __awaiter = Vow.delay(0, 1);
            }
        case 13: {
                console.log("unknown x == " + x);
                __state = 1;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main(0, 0).then(function() {
    return main(0, 1);
}).then(function() {
    return main(0, 2);
}).then(function() {
    return main(0, 3);
}).then(function() {
    return main(0, 4);
}).then(function() {
    return main(0, 5);
});
