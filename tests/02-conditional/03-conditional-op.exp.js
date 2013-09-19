var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var main = function (x) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var $1;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                if (x == 1) {
                    $1 = 1;
                    __state = 2;
                    return __continue;
                } else {
                    __state = 4;
                    return Vow.fulfill(2);
                }
            }
        case 2: {
                console.log($1);
                __state = -1;
                __builder.ret();
                break;
            }
        case 4: {
                $1 = __builder.val;
                __state = 2;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
};

main(1).then(function() {
    main(2);
});
