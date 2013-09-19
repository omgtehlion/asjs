//
// https://github.com/omgtehlion/asjs
//
// Authors:
//   Anton A. Drachev (anton@drachev.com)
//
// Licensed under the terms of BSD 2-Clause License.
// See license.txt file for the full text of the license.
//

var tmpl = require("./templates");
var utils = require("./utils");
var Map = utils.Map;

var Scope = function(ast, replacing) {
    this.used = new Map();
    this.params = [];
    this.locals = new Map();
    this.remapNeeded = new Map({ "arguments": [], "this": [] });
    this.remapped = new Map();
    this.tempVars = [];
    this.special = new Map();
    this.children = [];
    this.globals = new Map();
    this.funcNames = new Map();
    this.process(ast, replacing);
};
/** @private */
Scope.prototype.process = function(ast, replacing) {
    var self = this;
    // take formal params
    this.addParams(ast.params);
    // hoist all locals
    utils.replace(ast.body, {
        enter: function(node, parent) {
            if (node.type === "FunctionExpression" || node.type === "FunctionDeclaration") {
                // skip inline functions for now
                return utils.Skip;
            }
            if (node.type === "VariableDeclaration") {
                if (node.kind !== "var")
                    throw "not implemented";
                var forInit = parent.type === "ForStatement" && node === parent.init;
                return self.processVars(node.declarations, replacing, forInit);
            }
        }
    });
    // find all referenced
    utils.traverse(ast.body, {
        enter: function(node, parent) {
            if (node.type === "FunctionExpression" || node.type === "FunctionDeclaration") {
                if (node.id)
                    self.funcNames.set(node.id.name, true);
                self.adopt(new Scope(node, false));
                return utils.Skip;
            }
            if (node.type === "MemberExpression") {
                utils.traverse(node.object, this.visitor);
                return utils.Skip;
            }
            if (replacing && node.type === "ThisExpression") {
                node.type = "Identifier";
                node.name = "this";
            }
            if (node.type === "Identifier") {
                self.used.set(node.name, true);
                if (replacing) {
                    var remap = self.remapNeeded.get(node.name);
                    if (remap)
                        remap.push(node);
                }
            }
        }
    });
    // estimate referenced globals
    this.used.forEach(function(name) {
        if (!self.locals.get(name)
                && !self.funcNames.get(name)
                && self.params.indexOf(name) === -1
                && name !== "this"
                && name !== "arguments")
            self.globals.set(name, true);
    });
    // remap where needed
    this.remapNeeded.forEach(function(key, value) {
        if (value.length === 0)
            return;
        var remapped = self.genName("__" + key);
        self.remapped.set(key, remapped);
        value.forEach(function(node) {
            node.name = remapped;
        });
    });
};
/** @private */
Scope.prototype.adopt = function(child) {
    this.children.push(child);
    child.globals.forEach(function(name) { this.used.set(name, true); }.bind(this));
};
/** @private */
Scope.prototype.addParams = function(params) {
    for (var i = 0; i < params.length; i++) {
        if (params[i].type !== "Identifier")
            throw "notimplemented";
        if (this.used.get(params[i].name))
            throw "name already taken: " + params[i].name;
        this.used.set(params[i].name, true)
        this.params.push(params[i].name);
    }
};
/** @private */
Scope.prototype.processVars = function(declarations, replacing, forInit) {
    var initializers = [];
    for (var i = 0; i < declarations.length; i++) {
        var decl = declarations[i];
        if (decl.type !== "VariableDeclarator" || decl.id.type !== "Identifier")
            throw "not implemented";
        this.locals.set(decl.id.name, true);
        if (decl.init)
            initializers.push(decl);
    }
    if (!replacing)
        return;
    if (!initializers.length)
        return null;
    initializers = initializers.map(function(decl) {
        return tmpl.assign({ type: "Identifier", name: decl.id.name }, decl.init);
    });
    var result = (initializers.length > 1) ? tmpl.sequence(initializers) : initializers[0];
    // special case for `init` part of ForStatement
    if (!forInit)
        result = tmpl.expression(result);
    return result;
};
/** @private */
Scope.prototype.genName = function(hint) {
    var result = hint;
    var i = 0;
    if (!hint) {
        hint = "$";
        result = hint + (++i);
    }
    while (this.used.get(result))
        result = hint + (++i);
    this.used.set(result, true);
    return result;
};
Scope.prototype.getTempVar = function() {
    var result = this.genName();
    this.tempVars.push(result);
    return result;
};
Scope.prototype.getSpec = function(name) {
    var result = this.special.get(name);
    if (!result) {
        result = this.genName("__" + name);
        this.special.set(name, result);
    }
    return result;
};

module.exports.Scope = Scope;
module.exports.process = function(workingSet) {
    workingSet.scope = new Scope(workingSet.ast, true);
};
