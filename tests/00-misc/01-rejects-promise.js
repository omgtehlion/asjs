/// {
///     description: 'Throwing an exception rejects promise',
///     stdout: 'data: 12345\
///              failed: 12345'
/// }

var main = async(function() {
    var data = 12345;
    console.log("data: " + data);
    throw data;
});

main().then(function(x) {
    console.log("returned: " + x);
}, function(y) {
    console.log("failed: " + y);
});
