/// {
///     description: 'ContinueStatement',
///     stdout: 'i = 0, j = 0\
///              i = 0, j = 1\
///              i = 0, j = 2\
///              i = 1, j = 0\
///              i = 2, j = 0\
///              i = 2, j = 1\
///              i = 2, j = 2\
///              done'
/// }

var Vow = require("vow");

var main = async(function() {
    var i, j;
    loop1:
    for (i = 0; i < 3; i++) {           //The first for statement is labeled "loop1"
        loop2:
        for (j = 0; j < 3; j++) {       //The second for statement is labeled "loop2"
            if (i == 1 && j == 1) {
                continue loop1;
            } else {
                console.log("i = " + i + ", j = " + await(Vow.fulfill(j)));
            }
        }
    }
    console.log("done");
    // Notice how it skips both "i = 1, j = 1" and "i = 1, j = 2"
});

main();
