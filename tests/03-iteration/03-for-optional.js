/// {
///     description: 'ForStatement with optional parts',
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
    var i = 0;
    for (;;) {
        console.log(await(Vow.fulfill("i = " + i)));
        if (i++ >= 4)
            break;
    }
    console.log("exiting");
});

main();
