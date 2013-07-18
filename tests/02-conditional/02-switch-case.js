/// {
///     description: 'SwitchStatement, all-in-one test',
///     stdout: 'entering, y=0\nx == 0, maybe\
///              entering, y=1\nx == 1\nx is 1 or 2 or 3\nexiting\
///              entering, y=2\nx is 1 or 2 or 3\nexiting\
///              entering, y=3\nx is 1 or 2 or 3\nexiting\
///              entering, y=4\nx is 4\nexiting\
///              entering, y=5\nunknown x == 5\nx == 0, maybe'
/// }

var Vow = require("vow");
var main = async(function(x, y) {
    console.log("entering, y=" + y);
    switch (x = y) {
        default:
            await(Vow.delay(0, 1));
            console.log("unknown x == " + x);
            // fall through
        case 0:
            console.log("x == 0, maybe");
            return 0;
        case 1:
            await(Vow.delay(0, 1));
            console.log("x == 1");
            // fall through again
        case 2:
        case 3:
            console.log("x is 1 or 2 or 3");
            break;
        case 4:
            console.log("x is 4");
            break;
    }
    console.log("exiting");
});

main(0, 0).then(function() {
    return main(0, 1);
}).then(function() {
    return main(0, 2);
}).then(function() {
    return main(0, 3);
}).then(function() {
    return main(0, 4);
}).then(function() {
    return main(0, 5);
});
