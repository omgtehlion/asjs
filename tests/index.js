var compilerSupport=require('../src/compilerSupport.js');var exec = require("child_process").exec;
var fs = require("fs");
var path = require("path");
var preprocess = require("../src/preprocess");
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

var runTests = function (rootDir) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var sections, i;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                sections = fs.readdirSync(rootDir).filter(function (d) {
                    if (!/\d+-/.test(d))
                        return false;
                    if (process.argv.length > 2 && d.lastIndexOf(process.argv[2], 0) !== 0)
                        return false;
                    var stat = fs.statSync(path.join(rootDir, d));
                    return stat && stat.isDirectory();
                });
                sections.sort();
                i = 0;
                __state = 1;
                return __continue;
            }
        case 1: {
                if (i < sections.length) {
                    __state = 3;
                    return __awaiter = runSection(rootDir, sections[i]);
                } else {
                    console.log("Totals:");
                    console.log("    " + bold(totals.tests) + " tests" + (", " + color(totals.ok, GREEN) + " ok") + (totals.changed ? ", " + color(totals.changed, YELLOW) + " changed" : "") + (totals.failed ? ", " + color(totals.failed, RED) + " failed" : ""));
                    __state = -1;
                    __builder.ret();
                    break;
                }
            }
        case 3: {
                i++;
                __state = 1;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

var runSection = function (root, dir) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1;
    var files, i, test;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                console.log("[ " + dir + " ]");
                dir = path.join(root, dir);
                files = fs.readdirSync(dir).filter(function (f) {
                    return /^\d+-/.test(f) && /\.js$/.test(f);
                });
                files = files.filter(function (f) {
                    return !/(\.tmp|\.out|\.exp)\.js$/.test(f);
                });
                files.sort();
                i = 0;
                __state = 1;
                return __continue;
            }
        case 1: {
                if (i < files.length) {
                    totals.tests++;
                    process.stdout.write("    " + pad(files[i].replace(/\.js$/, ""), 25));
                    __state = 3;
                    return __awaiter = runTest(dir, files[i]);
                } else {
                    console.log();
                    __state = -1;
                    __builder.ret();
                    break;
                }
            }
        case 3: {
                $1 = __awaiter.valueOf();
                test = $1;
                process.stdout.write("  " + pad(test.description || "", 60));
                report(test.status || "???");
                if (test.details)
                    test.details.forEach(function (line) {
                        console.log("> " + line);
                    });
                i++;
                __state = 1;
                return __continue;
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    });
}

var runTest = function (dir, f) {
    var __builder = new compilerSupport.TaskBuilder(), __state = 0, __awaiter, __continue = __builder.CONT, __ex;
    var $1, $2;
    var fname, test, processed, expected, compare, run, err;
    return __builder.run(function () {
        switch (__state) {
        case 0: {
                __state = 1;
                return __continue;
            }
        case 1: {
                test = parseTest(fname = path.join(dir, f));
                __state = 3;
                return __continue;
            }
        case 2: {
                var ex = __ex;
                $1 = {
                    status: "corrupt",
                    details: [ex]
                };
                __state = -1;
                __builder.ret($1);
                break;
            }
        case 3: {
                __state = 4;
                return __continue;
            }
        case 4: {
                processed = preprocess.doFile(test.src, { csFile: "../../src/compilerSupport" });
                fs.writeFileSync(fname.replace(/\.js$/, ".tmp.js"), processed, "utf-8");
                __state = 6;
                return __continue;
            }
        case 5: {
                var ex = __ex;
                test.status = "throw";
                test.details = [ex];
                __state = -1;
                __builder.ret(test);
                break;
            }
        case 6: {
                expected = fs.readFileSync(fname.replace(/\.js$/, ".exp.js"), "utf-8");
                __state = 8;
                return __continue;
            }
        case 7: {
                var ex = __ex;
                expected = "";
                __state = 8;
                return __continue;
            }
        case 8: {
                __state = 9;
                return __continue;
            }
        case 9: {
                compare = function (expected, got) {
                    var isRegex = expected instanceof RegExp;
                    var m = isRegex ? expected.exec(got.trim()) : expected === got.trim();
                    if (!m) {
                        test.status = "fail";
                        var exp = isRegex ? "/" + expected.source + "/" : JSON.stringify(expected);
                        test.details = ["expected: " + exp, "got: " + JSON.stringify(got)];
                    } else if (isRegex && test.params.assert && !test.params.assert(m)) {
                        test.status = "fail";
                        test.details = ["assertion failed, m=" + JSON.stringify(m)];
                    }
                };
                __state = 10;
                return __awaiter = execTest(f, dir);
            }
        case 10: {
                $2 = __awaiter.valueOf();
                run = $2;
                if ("stdout" in test.params) {
                    compare(test.params.stdout, run.stdout);
                } else if ("stderr" in test.params) {
                    compare(test.params.stderr, run.stderr);
                } else if ("error" in test.params) {
                    err = test.params.error;
                    if (!Array.isArray(err))
                        err = [err];
                    if (err.indexOf(run.error.code) === -1) {
                        test.status = "fail";
                        test.details = ["expected error: " + err, "got error: " + error.code];
                    }
                } else {
                    test.status = "corrupt";
                    test.details = ["nothing to verify, check your test"];
                }
                if (test.status) {
                    __state = -1;
                    __builder.ret(test);
                    break;
                } else {
                    test.status = "changed";
                    if (expected === processed) {
                        test.status = "ok";
                        fs.unlinkSync(fname.replace(/\.js$/, ".tmp.js"));
                    }
                    __state = -1;
                    __builder.ret(test);
                    break;
                }
            }
        default:
            throw 'Internal error: encountered wrong state';
        }
    }, function (ex) {
        var handler = [, 2, , , 5, , 7, 5, 5][__state];
        if (handler !== undefined) {
            __state = handler;
            __ex = ex;
            return __continue;
        }
    });
}

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
