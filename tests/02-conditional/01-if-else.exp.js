var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var i = 0;
var main = function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1, $2;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                console.log("entering", "i=" + i);
                if (i > 0) {
                    __state = 2;
                    return __awaiter = Vow.fulfill("i > 0");
                } else {
                    __state = 5;
                    return __awaiter = Vow.fulfill("i <= 0");
                }
            }
        case 2: {
                $1 = __awaiter.valueOf();
                console.log($1);
                __state = 3;
                return __continue;
            }
        case 3: {
                console.log("exiting");
                i++;
                __state = -1;
                __builder.ret();
                break;
            }
        case 5: {
                $2 = __awaiter.valueOf();
                console.log($2);
                __state = 3;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}
main().then(function() {
    main();
});
