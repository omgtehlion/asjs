/// {
///     description: 'Check that a semicolon is not lost',
///     stdout: 'data: 12345\
///              12345'
/// }

var main = async(function() {
    var data = 12345;
    console.log("data: " + data);
    return data;
});main().then(console.log, console.error);
