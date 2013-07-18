/// {
///     description: 'Function argument can be awaited',
///     stdout: 'main: 1 2 3'
/// }

var Vow = require("vow");

var promiseMe = function(i) {
    return Vow.fulfill(i);
};

var main = async(function() {
    console.log("main:", await(promiseMe(1)), 2, await(promiseMe(await(promiseMe(3)))));
});

main();
