/// {
///     description: 'DoWhileStatement',
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
    do {
        console.log(await(Vow.fulfill("i < 3")));
        i++;
    } while (i < 3);
    console.log("exiting");
});
main();
