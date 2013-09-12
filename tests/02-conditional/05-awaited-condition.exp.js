var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");

var thisShouldBeCalled = function(x) { console.log("thisShouldBeCalled");  return 1; };
var thisShouldnt = function(x) { console.error("ERROR: thisShouldnt"); return 0; };

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1, $2, $3;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = 1;
                return Vow.fulfill(true);
            }
        case 1: {
                $1 = __builder.val;
                if ($1) {
                    thisShouldBeCalled();
                    __state = 3;
                    return __continue;
                } else {
                    thisShouldnt();
                    __state = 3;
                    return __continue;
                }
            }
        case 3: {
                __state = 4;
                return Vow.fulfill(false);
            }
        case 4: {
                $2 = __builder.val;
                if ($2) {
                    $3 = thisShouldnt();
                    __state = 6;
                    return __continue;
                } else {
                    $3 = thisShouldBeCalled();
                    __state = 6;
                    return __continue;
                }
            }
        case 6: {
                console.log($3);
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
