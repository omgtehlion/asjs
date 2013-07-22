var preprocess = require("../src/preprocess");
var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;

var totals = { tests: 0, ok: 0, changed: 0, failed: 0 };

var spaces = new Array(100).join(" ");
function pad(str, sz) {
    if (str.length >= sz)
        return str.substr(0, sz);
    return str + spaces.substr(0, sz - str.length);
}
// see: http://misc.flogisoft.com/bash/tip_colors_and_formatting
var RED = 91, GREEN = 32, YELLOW = 93;
function color(str, color) {
    return "\033[" + color + "m" + str + "\033[39m";
}
function bold(str) {
    // NOTE: should end with [21m, but it seems to screw up some terminals
    return "\033[1m" + str + "\033[22m";
}
function report(status) {
    if (status === "ok")
        totals.ok++;
    else if (status === "changed")
        totals.changed++;
    else
        totals.failed++;
    var colStat = { "corrupt": RED, "throw": RED, "fail": RED, "ok": GREEN, "changed": YELLOW }[status];
    console.log("[ " + color(pad(status, 7), colStat) + " ]");
}

function runTests(rootDir) {
    var sections = fs.readdirSync(rootDir).filter(function(d) {
        if (!/\d+-/.test(d))
            return false;
        if (process.argv.length > 2) {
            if (d.lastIndexOf(process.argv[2], 0) !== 0)
                return false;
        }
        var dir = path.join(rootDir, d);
        var stat = fs.statSync(dir);
        return stat && stat.isDirectory();
    });
    sections.sort();
    var i = 0;
    var runNextSection = function() {
        if (i < sections.length)
            runSection(rootDir, sections[i++], runNextSection);
        else
            reportTotals();
    };
    runNextSection();
}

function runSection(root, dir, callback) {
    console.log("[ " + dir + " ]");
    dir = path.join(root, dir);
    var files = fs.readdirSync(dir).filter(function(f) { return /^\d+-/.test(f) && /\.js$/.test(f); });
    files = files.filter(function(f) { return !/(\.tmp|\.out|\.exp)\.js$/.test(f); });
    files.sort();
    var i = 0;
    var runNextTest = function() {
        if (i < files.length) {
            runTest(dir, files[i++], runNextTest);
        } else {
            console.log();
            callback();
        }
    };
    runNextTest();
}

function runTest(dir, f, callback) {
    totals.tests++;
    process.stdout.write("    " + pad(f.replace(/\.js$/, ""), 25));
    var fname, test;
    try {
        test = parseTest(fname = path.join(dir, f));
        var descr = test.params.description;
        process.stdout.write("  " + pad(descr, 60));
    } catch (ex) {
        process.stdout.write("  " + pad("", 60));
        report("corrupt");
        console.log(">" + ex);
        return callback();
    }
    try {
        var processed = preprocess.doFile(test.src, { csFile: "../../src/compilerSupport" });
        fs.writeFileSync(fname.replace(/\.js$/, ".tmp.js"), processed, "utf-8");
        try {
            var expected = fs.readFileSync(fname.replace(/\.js$/, ".exp.js"), "utf-8");
        } catch (ex) { expected = ""; }
    } catch (ex) {
        report("throw");
        console.log(">" + ex);
        return callback();
    }
    
    var child = exec("node " + f.replace(/\.js$/, ".tmp.js"), { cwd: dir }, function(error, stdout, stderr) {
        var compare = function(expected, got) {
            var isRegex = expected instanceof RegExp;
            var m = isRegex ? expected.exec(got.trim()) : (expected === got.trim());
            if (!m) {
                report("fail");
                var exp = isRegex ? "/" + expected.source + "/" : JSON.stringify(expected);
                console.log(">expected: " + exp);
                console.log(">got: " + JSON.stringify(got));
                return false;
            }
            if (isRegex && test.params.assert && !test.params.assert(m)) {
                report("fail");
                console.log(">assertion failed, m=" + JSON.stringify(m));
                return false;
            }
            return true;
        };

        if ("stdout" in test.params) {
            if (!compare(test.params.stdout, stdout))
                return callback();
        } else if ("stderr" in test.params) {
            if (!compare(test.params.stderr, stderr))
                return callback();
        } else if ("error" in test.params) {
            var err = test.params.error;
            if (!Array.isArray(err))
                err = [err];
            if (err.indexOf(error.code) === -1) {
                report("fail");
                console.log(">expected error " + test.params.error);
                console.log(">got error " + error.code);
                return callback();
            }
        } else {
            report("corrupt");
            console.log(">nothing to verify, check your test");
            return callback();
        }
        if (expected === processed) {
            fs.unlinkSync(fname.replace(/\.js$/, ".tmp.js"));
            report("ok");
        } else {
            report("changed");
        }
        return callback();
    });
};

function parseTest(f) {
    var testSrc = fs.readFileSync(f, "utf-8");
    // Strip UTF-8 BOM
    if (testSrc.charAt(0) === "\uFEFF")
        testSrc = testSrc.slice(1);
    var splitAt = testSrc.indexOf("\n\n");
    var params = testSrc.substr(0, splitAt).split(/[/]{3}\s*/g).join("").replace(/\\\n/g, "\\n");
    var src = testSrc.substr(splitAt + 2);
    return { params: eval('(' + params + ')'), src: src };
}

function reportTotals() {
    console.log("Totals:");
    console.log("    " + bold(totals.tests) + " tests" +
        (", " + color(totals.ok, GREEN) + " ok") +
        (totals.changed ? ", " + color(totals.changed, YELLOW) + " changed" : "") +
        (totals.failed ? ", " + color(totals.failed, RED) + " failed" : "")
    );
}

runTests(__dirname);
