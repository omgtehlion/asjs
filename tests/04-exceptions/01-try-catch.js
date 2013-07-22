/// {
///     description: 'Try-catch should catch rejected promise',
///     stdout: /result: ex caught: Error: [A-Z]+, read/
/// }

var fs = require("fs");
require("../include/promisify");

var main = async(function() {
    try {
        var data = await(fs.readFile.promise("..", 'utf-8'));
    } catch (ex) {
        return "ex caught: " + ex;
    //} finally {
    //    console.log("finalizer run");
    }
    return data;
});

main().then(
    function(data) { console.log("result: " + data); },
    function(err) { console.error("error: " + err); }
);
