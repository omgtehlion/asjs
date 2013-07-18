/// {
///     description: 'Check a deeply nested return',
///     stdout: 'promised'
/// }

var Vow = require("vow");
var main = async(function(i) {
    if (true) {
        if (true) {
            if (false) {
            } else {
                return await(Vow.fulfill(i));
            }
        }
    }
});

main("promised").then(function(x) {
    console.log(x);
});
