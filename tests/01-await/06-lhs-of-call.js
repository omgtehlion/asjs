/// {
///     description: 'Await at the left-hand side of a func call',
///     stdout: 'hello!\
///              1, 2, 3\
///              1, 2, 3\
///              bye!'
/// }

var Vow = require("vow");

var main = async(function() {
    var promisedFunc = Vow.fulfill(function(s) { console.log(s); });
    await(promisedFunc)("hello!");

    var promisedArray = Vow.fulfill([ 0, 1, 2 ]);
    
    var arr = await(promisedArray).map(function(x) { return x + 1; });
    console.log(arr.join(", "));

    var arr = await(promisedArray)["ma" + "p"](function(x) { return x + 1; });
    console.log(arr.join(", "));

    console[await(Vow.fulfill("log"))]("bye!");
});
main();
