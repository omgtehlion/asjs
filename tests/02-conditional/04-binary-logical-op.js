/// {
///     description: 'Check short-circuit evaluation of || and &&',
///     stdout: 'thisShouldBeCalled\
///              1\
///              thisShouldBeCalled\
///              2\
///              thisShouldBeCalled'
/// }

var Vow = require("vow");
var thisShouldBeCalled = function(x) {
    console.log("thisShouldBeCalled");
    return Vow.fulfill(x);
};

var thisShouldnt = function(x) {
    console.error("ERROR: thisShouldnt");
    return Vow.fulfill(x);
};

var main = async(function() {
    console.log(0 || await(thisShouldBeCalled(1)));
    console.log(1 && await(thisShouldBeCalled(2)));

    1 || await(thisShouldnt(3));
    0 && await(thisShouldnt(4));

    await(thisShouldBeCalled(5)) || await(thisShouldnt(6));
});

main();
