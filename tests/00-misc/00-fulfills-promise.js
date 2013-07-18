/// {
///     description: 'Returning a value should fulfill promise',
///     stdout: 'data: 12345\
///              returned: 12345'
/// }

var main = async(function() {
    var data = 12345;
    console.log("data: " + data);
    return data;
});

main().then(function(x) {
    console.log("returned: " + x);
}, function(y) {
    console.log("failed: " + y);
});
