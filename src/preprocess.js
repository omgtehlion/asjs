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

var Preprocess = {};

Preprocess._doFile = function(fileName, tmpExt, bro) {
    var content = fs.readFileSync(fileName, "utf-8");
    var parsed = utils.parse(content, { raw: true, range: true });

    var toReplace = [];

    utils.traverse(parsed, {
        enter: function(node, parent) {
            if (node.type === "CallExpression") {
                if (node.callee.name === "async") {
                    toReplace.push({ ast: node.arguments[0], range: node.range });
                    return utils.Skip;
                }
            }
        }.bind(this),
    });

    if (!toReplace.length)
        return content;

    var result = [];

    var compilerSupport = "compilerSupport";
    var csFile = path.resolve(__dirname, "compilerSupport.js");
    csFile = path.relative(path.dirname(fileName), csFile);
    if (bro) {
        var vow = fs.readFileSync(path.resolve(__dirname, "../node_modules/vow/vow.min.js"), "utf-8");
        var csup = fs.readFileSync(path.resolve(__dirname, "compilerSupport.js"), "utf-8");
        result.push(csup.replace(/var Vow = require\("vow"\);/, vow + "\nvar compilerSupport = {};\n").replace(/module\.exports/g, compilerSupport));
    } else {
        result.push(utils.codegen(
            tmpl.require(compilerSupport, csFile),
            { format: { indent: { style: '', base: 0 }, compact: true } }
        ));
    }

    var lastInd = 0;
    var self = this;
    toReplace.forEach(function(item) {
        var ast = self.doFunction(item.ast, compilerSupport);
        if (lastInd > item.range[0])
            throw "unexpected index " + item.range[0];
        if (lastInd < item.range[0])
            result.push(content.substring(lastInd, item.range[0]));

        result.push(utils.codegen(ast, { parse: utils.parse }));
        lastInd = item.range[1] + 1;
    });
    if (lastInd < content.length)
        result.push(content.substring(lastInd));
    content = result.join("");
    if (tmpExt)
        fs.writeFileSync(fileName.replace(/\.\w+$/, tmpExt), content, "utf-8");
    return content;
};

Preprocess.doFile = function(content, options) {
    options = options || {};
    var parsed = utils.parse(content, { raw: true, range: true });

    var toReplace = [];

    utils.traverse(parsed, {
        enter: function(node, parent) {
            if (node.type === "CallExpression" && node.callee.name === "async") {
                toReplace.push({ ast: node.arguments[0], range: node.range });
                return utils.Skip;
            }
        }.bind(this),
    });

    if (!toReplace.length)
        return null;

    var result = [];
    var compilerSupport = options.compilerSupport || "compilerSupport";
    var csFile = options.csFile || "asjs/src/compilerSupport";
    result.push(utils.codegen(
        tmpl.require(compilerSupport, csFile),
        { format: { indent: { style: '', base: 0 }, compact: true } }
    ));
    var lastInd = 0;
    var self = this;
    toReplace.forEach(function(item) {
        var ast = self.doFunction(item.ast, compilerSupport);
        if (lastInd > item.range[0])
            throw "unexpected index " + item.range[0];
        if (lastInd < item.range[0])
            result.push(content.substring(lastInd, item.range[0]));
        result.push(utils.codegen(ast, { parse: utils.parse }));
        lastInd = item.range[1] + 1;
    });
    if (lastInd < content.length)
        result.push(content.substring(lastInd));
    return result.join("");
};

var dump = function(name, obj) {
    //require("fs").writeFileSync(name + ".tmp.json", JSON.stringify(obj, null, 4), "utf-8");
};

Preprocess.doFunction = function(ast, compilerSupport) {
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
        ast.body = tmpl.block([tmpl.throw("Cannot compile: " + ex)]);
    }
    return ast;
};

module.exports = Preprocess;
