/// {
///     description: 'ForStatement, with syncronous body',
///     rationale: 'Init part should not contain statement, only expression.\
///                 Be careful when hoisting locals.',
///     stdout: 'entering\
///              i = 0, j = 10\
///              i = 1, j = 10\
///              i = 2, j = 10\
///              i = 3, j = 10\
///              i = 4, j = 10\
///              exiting'
/// }

var Vow = require("vow");
var main = async(function() {
    console.log("entering");
    for (var i = 0, j = 10; i < 5; i++)
        console.log("i = " + i + ", j = " + j);
    console.log(await(Vow.fulfill("exiting")));
});

main();
