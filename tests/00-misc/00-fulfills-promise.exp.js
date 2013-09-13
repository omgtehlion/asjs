var compilerSupport=require('../../src/compilerSupport');var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var data;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                data = 12345;
                console.log("data: " + data);
                __state = -1;
                __builder.ret(data);
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

main().then(function(x) {
    console.log("returned: " + x);
}, function(y) {
    console.log("failed: " + y);
});
