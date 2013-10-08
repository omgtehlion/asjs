/// {
///     description: 'Await might be the last statement',
///     stdout: 'hello!'
/// }

var Vow = require("vow");

var main = async(function() {
    console.log("hello!");
    await(Vow.fulfill(0));
});
main();
