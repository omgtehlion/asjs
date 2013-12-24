// https://github.com/cujojs/promise-perf-tests
// http://thanpol.as/javascript/promises-a-performance-hits-you-should-be-aware-of/

// https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
// https://github.com/petkaantonov/bluebird/tree/master/benchmark/madeup-parallel
// https://github.com/petkaantonov/bluebird/tree/master/benchmark/doxbee-sequential

// https://github.com/medikoo/deferred#performance

var Vow = require("vow");
var when = require("when");
var lstat = require("fs").lstat;

var lstatAsync = function(path) {
    var result = Vow.promise();
    lstat(path, function(err, stats) {
        if (err)
            result.reject(err);
        else
            result.fulfill(stats);
    });
    return result;
};

var scatteredPromises = function(n, maxDelay) {
    var result = [];
    n /= 2;
    for (var i = 0; i < n; i++) {
        result.push(Vow.delay("ok", (i / n) * maxDelay));
        result.push(Vow.delay("ok", ((n - i) / n) * maxDelay));
    }
    return result;
};

var parallelLstats = function(n) {
    var result = [];
    for (var i = 0; i < n; i++)
        result.push(lstatAsync(__filename));
    return result;
};

module.exports = [
    {
        name: "Vow, sequential",
        run: function(runs) {
            var result = Vow.promise();

            var i = runs;
            var nextPromise = function() {
                if (i-- > 0) {
                    var promise = Vow.promise("ok");
                    promise.then(nextPromise);
                } else {
                    result.fulfill("ok");
                }
            };
            nextPromise();

            return result;
        }
    },

    {
        name: "Vow, chained then()",
        run: function(runs) {
            var i = runs;
            var promise = Vow.promise("ok");
            for (; i-- > 0;)
                promise = promise.then(function() { return Vow.promise("ok"); });
            return promise;
        }
    },

    {
        name: "Asjs, await async",
        run: async(function(runs) {
            var i = runs;
            for (; i-- > 0;) {
                await(async(function() {
                    return "ok";
                })());
            }
            return "ok";
        })
    },

    {
        name: "Vow + Asjs     ",
        run: async(function(runs) {
            var i = runs;
            for (; i-- > 0;)
                await(Vow.promise("ok"));
            return "ok";
        })
    },

    {
        name: "When, sequential",
        run: function(runs) {
            var result = Vow.promise();

            var i = runs;
            var nextPromise = function() {
                if (i-- > 0) {
                    var promise = when.resolve("ok");
                    promise.then(nextPromise);
                } else {
                    result.fulfill("ok");
                }
            };
            nextPromise();

            return result;
        }
    },

    {
        name: "When + Asjs    ",
        run: async(function(runs) {
            var i = runs;
            for (; i-- > 0;)
                await(when.resolve("ok"));
            return "ok";
        })
    },

    {
        name: "Vow, parallel rand",
        run: function(runs) {
            return Vow.all(scatteredPromises(500, 500));
        }
    },

    {
        name: "Asjs, parallel rand",
        run: async(function(runs) {
            var promises = scatteredPromises(500, 500);
            for (var i = 0; i < promises.length; i++)
                await(promises[i]);
            return "ok";
        })
    },

    {
        name: "Vow, lstat sequence",
        run: function(runs) {
            var result = Vow.promise();

            var i = runs;
            var nextPromise = function() {
                if (i-- > 0) {
                    lstatAsync(__filename).then(nextPromise);
                } else {
                    result.fulfill("ok");
                }
            };
            nextPromise();

            return result;
        }
    },

    {
        name: "Asjs, lstat sequence",
        run: async(function(runs) {
            var i = runs;
            for (; i-- > 0;) {
                await(lstatAsync(__filename));
            }
            return "ok";
        })
    },

    {
        name: "Vow, lstat parallel",
        run: function(runs) {
            return Vow.all(parallelLstats(runs));
        }
    },

    {
        name: "Asjs, lstat parallel",
        run: async(function(runs) {
            var promises = parallelLstats(runs);
            for (var i = 0; i < promises.length; i++)
                await(promises[i]);
            return "ok";
        })
    }
];
