/// {
///     description: 'Async for nested functions',
///     stdout: '[ 1, 2, 3 ]'
/// }

var Vow = require("vow");
var main = async(function() {
    var p = [ 0, 1, 2 ].map(async(function(x) {
        return await(Vow.fulfill(x + 1));
    }));
    p = await(Vow.all(p));
    console.log(p);
});

main();
