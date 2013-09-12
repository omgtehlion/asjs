/// {
///     description: 'Implementation details shouldn’t be visible to user',
///     stdout: '[object global]|globalVar|arg1|arg2|promised'
/// }

var Vow = require("vow");
var globalVar = "globalVar";

var main = async(function(arg1, arg2) {
    // check that builtin identifiers are not corrupted:
    var __builder = 1, __state = 2, __continue = 4;
    // add some locals
    var local0, local1 = global + "|" + globalVar + "|" + arg1;
    // reference `arguments`
    local1 += "|" + arguments[1];
    // reference `this`
    local1 += "|" + await(Vow.fulfill("promised"));
    console.log(local1);
    [ 0 ].forEach(function(this_should_not_be_included_in_scope) {
        var this_either = this_should_not_be_included_in_scope;
        this.dont_remap_this = 1;
        but_this_should = 1;
        __this = 1;
    });
});

main("arg1", "arg2");
