var fs = require("fs");
var path = require("path");
var preprocess = require("./preprocess");

module.exports.setupOnTheFly = function(tmpExt) {
    // load this file ahead
    require("./compilerSupport");
    require.extensions[".js"] = function(module, filename) {
        var src = fs.readFileSync(filename, "utf-8");
        var csFile = path.resolve(__dirname, "compilerSupport.js");
        var content = preprocess.doFile(src, { csFile: path.relative(path.dirname(filename), csFile) });
        if (content) {
            if (tmpExt)
                fs.writeFileSync(filename.replace(/\.\w+$/, tmpExt), content, "utf-8");
            return module._compile(content, filename);
        } else {
            return module._compile(src, filename);
        }
    };
    module.exports.setupOnTheFly = function() { };
};

//var originalToString = Function.prototype.toString;
//Function.prototype.toString = function() {
//    return originalToString.call(this);
//};

//// I know, I know...
//var _eval = function(x) { return eval(x); };

//var async = function(func) {
//    var src = func.toString();
//    var ast = esprima.parse("(" + src + ")").body[0].expression;
//    var processed = preprocess.doFunction(ast, "async");
//    //var params = processed.params.map(function(p) { return p.name; });
//    //var bodySrc = escodegen.generate(processed.body, { parse: esprima.parse });
//    //bodySrc = bodySrc.substr(1, bodySrc.length - 2);
//    //var result = Function.call(global, params);
//    return "(" + escodegen.generate(processed) + ")";
//};

//for (var i in compilerSupport)
//    async[i] = compilerSupport[i];

//module.exports = eval;
