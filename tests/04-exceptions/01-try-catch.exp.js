var compilerSupport=require('../../src/compilerSupport');var fs = require("fs");
require("../include/promisify");

var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1, $2;
    var data;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = 1;
                return __continue;
            }
        case 1: {
                __state = 3;
                return fs.readFile.promise("..", 'utf-8');
            }
        case 2: {
                var ex = __ex;
                $1 = "ex caught: " + ex;
                __state = -1;
                __builder.ret($1);
                break;
            }
        case 3: {
                $2 = __builder.val;
                data = $2;
                __state = 4;
                return __continue;
            }
        case 4: {
                __state = -1;
                __builder.ret(data);
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    }, function (ex) {
        var handler = [, 2, , 2][__state];
        if (handler !== undefined) {
            __state = handler;
            __ex = ex;
            return __continue;
        }
    });
};

main().then(
    function(data) { console.log("result: " + data); },
    function(err) { console.error("error: " + err); }
);
