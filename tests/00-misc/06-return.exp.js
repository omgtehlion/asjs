var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function (i) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                if (true) {
                    if (true) {
                        if (false) {
                            __state = 4;
                            return __continue;
                        } else {
                            __state = 7;
                            return Vow.fulfill(i);
                        }
                    } else {
                        __state = 4;
                        return __continue;
                    }
                } else {
                    __state = 5;
                    return __continue;
                }
            }
        case 4: {
                __state = 5;
                return __continue;
            }
        case 5: {
                __state = -1;
                __builder.ret();
                break;
            }
        case 7: {
                $1 = __builder.val;
                __state = -1;
                __builder.ret($1);
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main("promised").then(function(x) {
    console.log(x);
});
