/// {
///     description: 'IfStatement',
///     stdout: 'entering i=0\
///              exiting\
///              entering i=1\
///              i > 0\
///              exiting'
/// }

var Vow = require("vow");
var i = 0;
var main = async(function() {
    console.log("entering", "i=" + i);
    if (i > 0)
        console.log(await(Vow.fulfill("i > 0")));
    console.log("exiting");
    i++;
});
main().then(function() {
    main();
});
