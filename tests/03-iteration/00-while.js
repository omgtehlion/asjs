/// {
///     description: 'WhileStatement',
///     stdout: 'entering, i=0\
///              i < 3\
///              i < 3\
///              i < 3\
///              exiting'
/// }

var Vow = require("vow");
var i = 0;
var main = async(function() {
    console.log("entering, i=" + i);
    while (i < 3) {
        console.log(await(Vow.fulfill("i < 3")));
        i++;
    }
    console.log("exiting");
});

main();
