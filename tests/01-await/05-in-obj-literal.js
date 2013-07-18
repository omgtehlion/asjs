/// {
///     description: 'Await is allowed inside object literal',
///     stdout: 'main { a: 1, b: 2, c: 3 }'
/// }

var Vow = require("vow");
var main = async(function() {
    console.log("main", { "a": await(Vow.fulfill(1)), "b": 2, "c": await(Vow.fulfill(3)) });
});
main();
