/// {
///     description: '`break` out of while() statement',
///     stdout: 'i = 1\
///              i = 2\
///              i = 3\
///              done1\
///              i = 0\
///              i = 1\
///              i = 2\
///              done2'
/// }

var Vow = require("vow");
var main = async(function(x) {
    var i = 0;
    while (i < 6) {
        if (i == 3)
            break;
        i += 1;
        console.log("i = " + await(Vow.fulfill(i)));
    }
    console.log("done1");
    var i = 0;
    do {
        if (i > 2) {
            break;
        }
        console.log("i = " + await(Vow.fulfill(i)));
        i++;
    } while (i <= 5);
    console.log("done2");
});

main();
