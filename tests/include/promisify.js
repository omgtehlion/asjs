var Vow = require("vow");

Function.prototype.promise = function() {
    var promise = Vow.promise();
    var args = Array.prototype.slice.apply(arguments);
    args.push(function(err, data) {
        if (err)
            promise.reject(err);
        else
            promise.fulfill(data);
    });
    this.apply(null, args);
    return promise;
};
Function.prototype.promiseRev = function() {
    var promise = Vow.promise();
    var args = Array.prototype.slice.apply(arguments);
    args.unshift(function(err, data) {
        if (err)
            promise.reject(err);
        else
            promise.fulfill(data);
    });
    this.apply(null, args);
    return promise;
};
