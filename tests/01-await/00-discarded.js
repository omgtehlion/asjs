/// {
///     description: 'Should await even if value is discarded',
///     stdout: 'promised 1\nexiting'
/// }

var Vow = require("vow");
var promiseMe = function(i) {
    var promise = Vow.promise();
    setTimeout(function() {
        console.log("promised " + i);
        promise.fulfill("promised " + i);
    }, 10);
    return promise;
};

var main = async(function(i) {
    await(promiseMe(i));
    console.log("exiting");
});

main(1);
