// NOTE: run with `node --expose-gc`

var WARMUP_LIMIT_MS = 500;
var WARMUP_RUN_LIMIT_MS = 100;
var TEST_RUN_LIMIT_MS = 1000;
var TEST_RUNS = 8;

// test for async:
try {
    var x = async(function() { });
} catch (ex) {
    console.error("Please run this program with asjs enabled.");
    console.error("Use `node --expose-gc asjs benchmarks`");
    process.exit(1);
}

// test for available GC controls:
try {
    global.gc();
} catch (ex) {
    console.error("Please run this program with exposed gc control");
    console.error("Use `node --expose-gc asjs benchmarks`");
    process.exit(1);
}

/** calcs milliseconds elapsed between two hrtime() instances */
var timeDiff = function(start, end) {
    //  [seconds, nanoseconds]
    var diff = [end[0] - start[0], end[1] - start[1]];
    return diff[0] * 1e3 + diff[1] * 1e-6;
};

var prettify = function(num, significantPlaces) {
    var roundingPlaces = Math.floor(Math.log(num) / Math.LN10) - significantPlaces + 1;
    var rounding = Math.pow(10, roundingPlaces);
    num = rounding * Math.round(num / rounding);
    if (rounding < 1) {
        try {
            num = num.toFixed(-roundingPlaces);
        } catch (ex) { }
    }
    return num;
};

var runTest = async(function(test) {
    console.log("");
    var updateStatus = function(status) {
        console.log("\033[1A\033[K\r" + test.name + ": \t" + status);
    };

    var runsPerMs = 1;

    updateStatus("warmup...");
    var runAdjust = async(function(expectedMs) {
        var runs = Math.ceil(runsPerMs * expectedMs);
        var started = process.hrtime();
        await(test.run(runs));
        var elapsed = timeDiff(started, process.hrtime());
        if (elapsed <= 0)
            elapsed = 0.01;
        return runsPerMs = runs / elapsed;
    });

    global.gc();
    var runTill = +new Date() + WARMUP_LIMIT_MS;
    while (+new Date() < runTill) {
        await(runAdjust(WARMUP_RUN_LIMIT_MS));
    }

    var instances = [];
    for (var i = 0; i < TEST_RUNS; i++) {
        global.gc();
        updateStatus("run " + (i + 1) + " of " + TEST_RUNS + "...");
        instances.push(await(runAdjust(TEST_RUN_LIMIT_MS)));
    }
    instances.sort(function(a, b) { return a - b });
    instances.pop();
    instances.shift();
    var avg = instances.reduce(function(a, b) { return a + b; }, 0) / instances.length;
    updateStatus(prettify(avg, 3) + " runs/ms");
    //console.log(process.memoryUsage()); // .heapUsed
});


var runTests = async(function() {
    // lift some limits for tests
    process.maxTickDepth = Infinity;

    var tests = require("./tests");
    console.log("Running " + tests.length + " tests.");
    console.log("Values are mesured in operations per second, higher is better.");
    for (var i = 0; i < tests.length; i++) {
        await(runTest(tests[i]));
    }
});

runTests().then(
    function(data) { console.log("Done."); },
    function(err) { console.error("Error: " + err.stack || err); }
);
