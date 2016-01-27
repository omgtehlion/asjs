//
// https://github.com/omgtehlion/asjs
//
// Authors:
//   Anton A. Drachev (anton@drachev.com)
//
// Licensed under the terms of BSD 2-Clause License.
// See license.txt file for the full text of the license.
//

var fs = require("fs");
var path = require("path");

var tmpl = require("./templates");
var utils = require("./utils");
var scope = require("./scope");
var chop = require("./chop");
var generate = require("./generate");

var isAsync = function(node) {
    return node.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === "async";
};

module.exports.setupOnTheFly = function(tmpExt) {
    // load this file ahead
    require("./compilerSupport");

    var processSource = module.exports.processSource;
    var csFile = path.resolve(__dirname, "compilerSupport.js");

    require.extensions[".js"] = function(module, filename) {
        var src = fs.readFileSync(filename, "utf-8");
        // fix windows-style path names
        var relCsFile = path.relative(path.dirname(filename), csFile);
        if (path.sep !== "/")
            relCsFile = relCsFile.split(path.sep).join("/");
        var content = processSource(src, { csFile: relCsFile });
        if (content) {
            if (tmpExt)
                fs.writeFileSync(filename.replace(/\.[^.]+$/, tmpExt), content, "utf-8");
            return module._compile(content, filename);
        } else {
            return module._compile(src, filename);
        }
    };
    // setup only once
    module.exports.setupOnTheFly = function() { };
};

var dump = function(name, obj) {
    //require("fs").writeFileSync(name + ".tmp.json", JSON.stringify(obj, null, 4), "utf-8");
};

module.exports.processFuncAst = function(ast) {
    var processFuncAst = module.exports.processFuncAst;
    // process nested first
    utils.replace(ast.body, {
        enter: function(node, parent) {
            if (isAsync(node))
                return processFuncAst(node.arguments[0]);
        }
    });

    try {
        var ws = new utils.WorkingSet(ast);
        dump("ast", ws.ast);
        scope.process(ws);
        dump("scope", ws.scope);
        dump("ast-post-scope", ws.ast);
        chop.process(ws);
        dump("ast-cfg", ws.cfg);
        dump("flow", ws.blocks);
        generate(ws);
        ast = ws.ast;
    } catch (ex) {
        var msg = ex.toString() + (ex.stack || "");
        ast.body = tmpl.block([tmpl.throw("Cannot compile: " + msg)]);
    }
    return ast;
};

module.exports.processSource = function(content, options) {
    options = options || {};

    // Strip UTF-8 BOM
    if (content.charAt(0) === "\uFEFF")
        content = content.slice(1);

    var parsed = utils.parse(content, { raw: true, range: true });

    var toReplace = [];

    utils.traverse(parsed, {
        enter: function(node, parent) {
            if (isAsync(node)) {
                toReplace.push({ ast: node.arguments[0], range: node.range });
                return utils.Skip;
            }
        }
    });

    if (!toReplace.length)
        return null;

    var result = [];
    var lastInd = 0;

    var compilerSupport = options.compilerSupport || "compilerSupport";
    var csFile = ("csFile" in options) ? options.csFile : "asjs/src/compilerSupport";
    if (csFile) {
        result.push(utils.codegen(
            tmpl.require(compilerSupport, csFile),
            { format: { indent: { style: '', base: 0 }, compact: true } }
        ));
    }

    var processFuncAst = module.exports.processFuncAst;
    toReplace.forEach(function(item) {
        var ast = processFuncAst(item.ast);
        if (lastInd > item.range[0])
            throw "unexpected index " + item.range[0];
        if (lastInd < item.range[0])
            result.push(content.substring(lastInd, item.range[0]));
        result.push(utils.codegen(ast, { parse: utils.parse }));
        lastInd = item.range[1];
    });
    if (lastInd < content.length)
        result.push(content.substring(lastInd));
    return result.join("");
};

module.exports.processFile = function() {
};
