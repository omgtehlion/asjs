/// {
///     description: 'Arguments should be evaluated in correct order',
///     stdout: /promiseMe 0 (\d+)\
///              promiseMe 2 (\d+)\
///              main: 0 1 2/,
///     assert: function(m) { return (m[2] - m[1]) >= 30; }
/// }

var Vow = require("vow");
var x = +new Date();
var promiseMe = function(i) {
    console.log("promiseMe", i, new Date() - x);
    return Vow.fulfill(i);
};

var main = async(function() {
    console.log("main:", await(promiseMe(0)), await(Vow.delay(1, 30)), await(promiseMe(2)));
});

main();
