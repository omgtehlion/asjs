/// {
///     description: 'Do not fail on dead code',
///     stdout: '0'
/// }

var main = async(function(xxx) {
    return 0;
    switch (xxx) {
        default:
            break;
    }
});

main().then(console.log, console.error);
