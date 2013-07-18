/// {
///     description: 'Awaited value can be awaited',
///     stdout: 'main: 1'
/// }

var Vow = require("vow");
var promiseRec = function(i) {
    return Vow.fulfill(i);
};

var main = async(function() {
    var obj = { x: Vow.fulfill(1) };
    console.log("main:", await(await(promiseRec(obj)).x));
});

main();
