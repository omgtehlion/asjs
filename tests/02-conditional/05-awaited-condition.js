/// {
///     description: 'Condition can be awaited',
///     stdout: 'thisShouldBeCalled\
///              thisShouldBeCalled\
///              1'
/// }

var Vow = require("vow");

var thisShouldBeCalled = function(x) { console.log("thisShouldBeCalled");  return 1; };
var thisShouldnt = function(x) { console.error("ERROR: thisShouldnt"); return 0; };

var main = async(function() {
    if (await(Vow.fulfill(true)))
        thisShouldBeCalled();
    else
        thisShouldnt();

    console.log(await(Vow.fulfill(false)) ? thisShouldnt() : thisShouldBeCalled());
});

main();
