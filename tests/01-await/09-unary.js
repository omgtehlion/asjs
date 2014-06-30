/// {
///     description: 'Await in unary expression',
///     stdout: 'hello!'
/// }

var Vow = require("vow");

var main = async(function() {
    if (!await(Vow.fulfill(0)))
        console.log("hello!");
});
main();
