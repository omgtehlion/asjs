var compilerSupport=require('../../src/compilerSupport');var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1;
    var x;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = 1;
                return __awaiter = 3;
            }
        case 1: {
                $1 = __awaiter.valueOf();
                x = $1;
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main().then(
    function(data) { console.log("result: " + data); },
    function(err) { console.error("error: " + err); }
);
