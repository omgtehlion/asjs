/// {
///     description: 'Should throw if cannot transform',
///     error: [ 1, 8 ]
/// }

var main = async(function(fileName) {
    // with-statement will not be supported, ever
    with (x) {
        await(y);
    }
});
main();
