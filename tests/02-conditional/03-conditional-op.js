/// {
///     description: 'Conditional Operator ( ? : )',
///     stdout: '1\n2'
/// }

var Vow = require("vow");
var main = async(function(x) {
    console.log(x == 1 ? 1 : await(Vow.fulfill(2)));
});

main(1).then(function() {
    main(2);
});
