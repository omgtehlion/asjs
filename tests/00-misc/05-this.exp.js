var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var x = {
    promiseMe: function() {
        return Vow.fulfill("promised");
    },
    main: function () {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __continue = __builder.CONT, __ex;
    var __this = this;
    var $1;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = 1;
                return __this.promiseMe();
            }
        case 1: {
                $1 = __builder.val;
                console.log($1);
                __state = -1;
                __builder.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}
};

x.main();
