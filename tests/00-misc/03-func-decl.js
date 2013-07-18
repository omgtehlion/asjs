/// {
///     description: 'Function declarations should be left intact',
///     stdout: 'main:  0 1 2'
/// }

var Vow = require("vow");

var main = async(function() {
    var xxx = function() {
        return 1;
    };

    console.log("main: ", await(Vow.fulfill(0)), xxx(), yyy());

    function yyy() {
        return 2;
    }
});

main();
