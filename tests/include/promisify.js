var Vow = require("vow");

Function.prototype.promise = function() {
    var deferred = Vow.defer();
    var args = Array.prototype.slice.apply(arguments);
    args.push(function(err, data) {
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(data);
    });
    this.apply(null, args);
    return deferred.promise();
};
Function.prototype.promiseRev = function() {
    var deferred = Vow.defer();
    var args = Array.prototype.slice.apply(arguments);
    args.unshift(function(err, data) {
        if (err)
            deferred.reject(err);
        else
            deferred.resolve(data);
    });
    this.apply(null, args);
    return deferred.promise();
};
