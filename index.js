#!/usr/bin/env node

var preprocess = require("./src/preprocess");
var fs = require("fs");
var path = require("path");
var src = require("./src");

var flags = {};
for (var i = 2; i < process.argv.length;) {
    var arg = process.argv[i];
    if (!/^--/.test(arg))
        break;
    process.argv.splice(2, 1);
    var opt = arg.substr(2);
    if (opt.length === 0)
        break;
    flags[opt] = true;
}

if (flags["in-place"])
    flags.preprocess = true;
if (flags["raw"])
    flags.preprocess = true;

if (process.argv.length <= 2) {
    console.log(fs.readFileSync(__dirname + "/readme.txt", "utf-8"));
} else {
    if (flags.preprocess || flags.pre) {
        var options = {};
        if (flags.raw)
            options.csFile = null;
        for (var i = 2; i < process.argv.length; i++) {
            var content = fs.readFileSync(process.argv[i], "utf-8");
            content = preprocess.doFile(content, options) || content;
            if (flags["in-place"]) {
                fs.writeFileSync(process.argv[i], content, "utf-8");
            } else {
                console.log(content);
            }
        }
    } else {
        if (flags["tmp"] === true)
            flags["tmp"] = ".tmp";
        src.setupOnTheFly(flags["tmp"]);
        process.argv.splice(1, 1);
        process.argv[1] = path.resolve(process.argv[1]);
        require("module").runMain();
    }
}