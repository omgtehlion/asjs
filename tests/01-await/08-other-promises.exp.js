var compilerSupport=require('../../src/compilerSupport');var when = require("when");

ticks = 0;
var running = true;
var ticker = function() {
    ticks++;
    if (running)
        process.nextTick(ticker);
};
ticker();

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1;
    var resolved, start, i;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                resolved = when.resolve("hello!");
                __state = 1;
                return resolved;
            }
        case 1: {
                $1 = __builder.val;
                console.log($1);
                start = ticks;
                i = 0;
                __state = 2;
                return __continue;
            }
        case 2: {
                if (i < 1000) {
                    __state = 4;
                    return resolved;
                } else {
                    console.log(ticks - start);
                    running = false;
                    __state = -1;
                    __builder.ret();
                    break;
                }
            }
        case 4: {
                i++;
                __state = 2;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

main();
