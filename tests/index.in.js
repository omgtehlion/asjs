var exec = require("child_process").exec;
var fs = require("fs");
var path = require("path");
var asjs = require("../src");
var Vow = require("vow");

// *** String tools ***
var spaces = new Array(100).join(" ");
function pad(str, sz) {
    return (str.length >= sz) ? str.substr(0, sz) : (str + spaces.substr(0, sz - str.length));
}
// see: http://misc.flogisoft.com/bash/tip_colors_and_formatting
var RED = 91, GREEN = 32, YELLOW = 93;
function color(str, color) { return "\033[" + color + "m" + str + "\033[39m"; }
// NOTE: should end with [21m, but it seems to screw up some terminals
function bold(str) { return "\033[1m" + str + "\033[22m"; }

// *** Bookkeeping ***
var totals = { tests: 0, ok: 0, changed: 0, failed: 0 };
var report = function(status) {
    if (status in totals)
        totals[status]++;
    else
        totals.failed++;
    var colStat = { "ok": GREEN, "changed": YELLOW }[status] || RED;
    console.log("[ " + color(pad(status, 7), colStat) + " ]");
}

var runTests = async(function(rootDir) {
    var sections = fs.readdirSync(rootDir).filter(function(d) {
        if (!/\d+-/.test(d))
            return false;
        if (process.argv.length > 2 && d.lastIndexOf(process.argv[2], 0) !== 0)
            return false;
        var stat = fs.statSync(path.join(rootDir, d));
        return stat && stat.isDirectory();
    });
    sections.sort();
    for (var i = 0; i < sections.length; i++)
        await(runSection(rootDir, sections[i]));
    console.log("Totals:");
    console.log("    " + bold(totals.tests) + " tests" +
        (", " + color(totals.ok, GREEN) + " ok") +
        (totals.changed ? ", " + color(totals.changed, YELLOW) + " changed" : "") +
        (totals.failed ? ", " + color(totals.failed, RED) + " failed" : "")
    );
});

var runSection = async(function(root, dir) {
    console.log("[ " + dir + " ]");
    dir = path.join(root, dir);
    var files = fs.readdirSync(dir).filter(function(f) { return /^\d+-/.test(f) && /\.js$/.test(f); });
    files = files.filter(function(f) { return !/(\.tmp|\.out|\.exp)\.js$/.test(f); });
    files.sort();
    for (var i = 0; i < files.length; i++) {
        totals.tests++;
        process.stdout.write("    " + pad(files[i].replace(/\.js$/, ""), 25));
        var test = await(runTest(dir, files[i]));
        process.stdout.write("  " + pad(test.params.description || "", 60));
        report(test.status || "???");
        if (test.details)
            test.details.forEach(function(line) { console.log("> " + line); });
    }
    console.log();
});

var runTest = async(function(dir, f) {
    var fname, test;
    try {
        test = parseTest(fname = path.join(dir, f));
    } catch (ex) {
        return { status: "corrupt", details: [ ex ] };
    }
    try {
        var processed = asjs.processSource(test.src, { csFile: "../../src/compilerSupport" });
        fs.writeFileSync(fname.replace(/\.js$/, ".tmp.js"), processed, "utf-8");
        try {
            var expected = fs.readFileSync(fname.replace(/\.js$/, ".exp.js"), "utf-8");
        } catch (ex) { expected = ""; }
    } catch (ex) {
        test.status = "throw";
        test.details = [ ex ];
        return test;
    }

    if (test.params.exact) {
        if (expected === processed) {
            test.status = "ok";
            fs.unlinkSync(fname.replace(/\.js$/, ".tmp.js"));
        } else {
            test.status = "fail";
        }
        return test;
    }

    var compare = function(expected, got) {
        var isRegex = expected instanceof RegExp;
        var m = isRegex ? expected.exec(got.trim()) : (expected === got.trim());
        if (!m) {
            test.status = "fail";
            var exp = isRegex ? "/" + expected.source + "/" : JSON.stringify(expected);
            test.details = [ "expected: " + exp, "got: " + JSON.stringify(got) ];
        } else if (isRegex && test.params.assert && !test.params.assert(m)) {
            test.status = "fail";
            test.details = [ "assertion failed, m=" + JSON.stringify(m) ];
        }
    };

    var run = await(execTest(f, dir));
    if ("stdout" in test.params) {
        compare(test.params.stdout, run.stdout);
    } else if ("stderr" in test.params) {
        compare(test.params.stderr, run.stderr);
    } else if ("error" in test.params) {
        var err = test.params.error;
        if (!Array.isArray(err))
            err = [err];
        if (err.indexOf(run.error.code) === -1) {
            test.status = "fail";
            test.details = [ "expected error: " + err, "got error: " + error.code ];
        }
    } else {
        test.status = "corrupt";
        test.details = [ "nothing to verify, check your test" ];
    }
    if (test.status)
        return test;
    test.status = "changed";
    if (expected === processed) {
        test.status = "ok";
        fs.unlinkSync(fname.replace(/\.js$/, ".tmp.js"));
    }
    return test;
});

var execTest = function(f, dir) {
    var promise = Vow.promise();
    var child = exec("node " + f.replace(/\.js$/, ".tmp.js"), { cwd: dir }, function(err, so, se) {
        promise.fulfill({ error: err, stdout: so, stderr: se });
    });
    return promise;
};

var parseTest = function(f) {
    var testSrc = fs.readFileSync(f, "utf-8");
    // Strip UTF-8 BOM
    if (testSrc.charAt(0) === "\uFEFF")
        testSrc = testSrc.slice(1);
    var splitAt = testSrc.indexOf("\n\n");
    var params = testSrc.substr(0, splitAt).split(/[/]{3}\s*/g).join("").replace(/\\\n/g, "\\n");
    var src = testSrc.substr(splitAt + 2);
    return { params: eval('(' + params + ')'), src: src };
}

runTests(__dirname).then(null, console.error);
