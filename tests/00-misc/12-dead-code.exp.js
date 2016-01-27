var compilerSupport=require('../../src/compilerSupport');var main = function (xxx) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = -1;
                __builder.ret(0);
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

main().then(console.log, console.error);
