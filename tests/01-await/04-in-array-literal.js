/// {
///     description: 'Await is allowed inside array literal',
///     stdout: 'main [ 1, 2, 3 ]'
/// }

var Vow = require("vow");
var main = async(function() {
    console.log("main", [ await(Vow.fulfill(1)), 2, await(Vow.fulfill(3)) ]);
});
main();
