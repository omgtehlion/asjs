/// {
///     description: 'Should throw if awaited value is not a promise',
///     stderr: 'error: Awaited value is not a promise: 3'
/// }

var main = async(function() {
    var x = await(3);
});

main().then(
    function(data) { console.log("result: " + data); },
    function(err) { console.error("error: " + err); }
);
