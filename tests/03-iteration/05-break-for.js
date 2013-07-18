/// {
///     description: '`break` out of for() statement',
///     stdout: 'i = 0, j = 0\
///              i = 0, j = 1\
///              i = 0, j = 2\
///              i = 1, j = 0\
///              done'
/// }

var Vow = require("vow");
var main = async(function() {
    var i, j;

    loop1:
    for (i = 0; i < 3; i++) {
        loop2:
        for (j = 0; j < 3; j++) {
            if (i == 1 && j == 1) {
                break loop1;
            } else {
                console.log("i = " + i + ", j = " + await(Vow.fulfill(j)));
            }
        }
    }
    console.log("done");
});

main();
