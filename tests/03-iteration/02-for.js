/// {
///     description: 'ForStatement',
///     stdout: 'entering\
///              i = 0\
///              i = 1\
///              i = 2\
///              i = 3\
///              i = 4\
///              exiting'
/// }

var Vow = require("vow");
var main = async(function() {
    console.log("entering");
    for (var i = 0; i < 5; i = await(Vow.fulfill(i + 1)))
        console.log(await(Vow.fulfill("i = " + i)));
    console.log("exiting");
});

main();
