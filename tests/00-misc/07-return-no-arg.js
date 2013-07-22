/// {
///     description: 'Argumentless return',
///     stdout: 'undefined'
/// }

var Vow = require("vow");
var main = async(function(i) {
    return;
});

var main2 = async(function(i) {
    // should generate exactly the same code
    return undefined;
});

main("promised").then(function(x) {
    console.log(typeof(x));
});
