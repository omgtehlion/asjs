//
// https://github.com/omgtehlion/asjs
//
// Authors:
//   Anton A. Drachev (anton@drachev.com)
//
// Licensed under the terms of BSD 2-Clause License.
// See license.txt file for the full text of the license.
//

var esprima = require("esprima");
var estraverse = require("estraverse");
var escodegen = require("escodegen");

// Exceptions
exports.ARE_YOU_MAD = "this usage of await() is not supported, and unlikely to be";
exports.COME_LATER = "this case is not yet supported, please contact me";
exports.DA_FUK_IS_THAT = "compiler internal structures are corrupted, please contact me";

// Temp variable storage
var TempVar = function(resultUsedIn) {
    this.__uniq = TempVar.gen++;
    this.__usedIn = resultUsedIn;
    this.__forced = false;
};
TempVar.gen = 0;
exports.TempVar = TempVar;

// Generic map class
var Map = function(init) {
    this._ = {};
    if (init) {
        for (var i in init) if (init.hasOwnProperty(i))
            this.set(i, init[i]);
    }
};
Map.prototype.set = function(key, value) { this._["." + key] = value; };
Map.prototype.get = function(key) { return this._["." + key]; };
Map.prototype.keys = function(key) { return Object.keys(this._).map(function(key) { return key.substr(1); }); };
Map.prototype.count = function(key) { return Object.keys(this._).length; };
Map.prototype.forEach = function(callback) {
    var _ = this._;
    Object.keys(_).forEach(function(key) {
        callback(key.substr(1), _[key]);
    });
};
Map.prototype.map = function(callback) {
    var _ = this._;
    return Object.keys(_).map(function(key) {
        return callback(key.substr(1), _[key]);
    });
};
exports.Map = Map;

// collection of everything involved
exports.WorkingSet = function(ast) {
    this.compilerSupport = "compilerSupport";
    this.ast = ast;
    this.scope = undefined;
    this.cfg = undefined;
    this.blocks = [];
    this.handlers = [];
    this.declaredFuncs = [];
};

// reimport libs
exports.parse = esprima.parse;
exports.traverse = estraverse.traverse;
exports.replace = estraverse.replace;
exports.Break = estraverse.VisitorOption.Break;
exports.Skip = estraverse.VisitorOption.Skip;
exports.codegen = escodegen.generate;
