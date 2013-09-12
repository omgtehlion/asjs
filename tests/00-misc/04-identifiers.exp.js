var compilerSupport=require('../../src/compilerSupport');var Vow = require("vow");
var globalVar = "globalVar";

var main = function (arg1, arg2) {
    var __builder1 = new compilerSupport.TaskBuilder(), __state1 = 0, __continue1 = __builder1.CONT, __ex;
    var __arguments = arguments;
    var $1, $2;
    var __builder, __state, __continue, local0, local1;
    return __builder1.run(function () {
        switch (__state1) {
        case 0: {
                __builder = 1, __state = 2, __continue = 4;
                local1 = global + "|" + globalVar + "|" + arg1;
                local1 += "|" + __arguments[1];
                __state1 = 1;
                return Vow.fulfill("promised");
            }
        case 1: {
                $1 = __builder1.val;
                $2 = "|" + $1;
                local1 += $2;
                console.log(local1);
                [0].forEach(function (this_should_not_be_included_in_scope) {
                    var this_either = this_should_not_be_included_in_scope;
                    this.dont_remap_this = 1;
                    but_this_should = 1;
                    __this = 1;
                });
                __state1 = -1;
                __builder1.ret();
                break;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

main("arg1", "arg2");
