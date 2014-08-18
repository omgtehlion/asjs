/// {
///     description: 'Should await even if value is discarded',
///     stdout: 'promised 1\nexiting'
/// }

var Vow = require("vow");
var promiseMe = function(i) {
    var deferred = Vow.defer();
    setTimeout(function() {
        console.log("promised " + i);
        deferred.resolve("promised " + i);
    }, 10);
    return deferred .promise();
};

var main = async(function(i) {
    await(promiseMe(i));
    console.log("exiting");
});

main(1);
