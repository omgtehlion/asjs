var exec = require("child_process").exec;
var fs = require("fs");

var input = fs.readFileSync(__dirname + "/runtime.min.js.in", "utf-8");
var vow = fs.readFileSync(__dirname + "/node_modules/vow/vow.min.js", "utf-8");
var csup = fs.readFileSync(__dirname + "/src/compilerSupport.js", "utf-8");

input = input.replace(/#vow\.min\.js#/, vow);

csup = csup.substr(csup.indexOf("//#begin"));
csup = csup.substr(0, csup.indexOf("//#end"));
input = input.replace(/#compilerSupport\.js#/, csup);

input = input.replace(/\/\*\*/g, "/*!*");

fs.writeFileSync(__dirname + "/runtime.min.tmp", input, "utf-8");

// oh, crap
// "java -jar ../tools/yuicompressor-2.4.7.jar --type js --charset utf-8 runtime.min.tmp"
var child = exec("..\\yui\\yuicompressor-2.4.2.exe --type js --charset utf-8 runtime.min.tmp", { cwd: __dirname }, function(error, stdout, stderr) {
    fs.unlinkSync(__dirname + "/runtime.min.tmp");
    fs.writeFileSync(__dirname + "/runtime.min.js", stdout, "utf-8");
});
