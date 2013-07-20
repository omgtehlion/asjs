//
// https://github.com/omgtehlion/asjs
//
// Authors:
//   Anton A. Drachev (anton@drachev.com)
//
// Licensed under the terms of BSD 2-Clause License.
// See license.txt file for the full text of the license.
//

var Vow = require("vow");
// TODO: support other promises libs http://wiki.commonjs.org/wiki/Promises

//#begin
var aProto = Array.prototype;
var bind = Function.prototype.bind || (function(oThis) {
    var fn = this;
    var args = aProto.slice.call(arguments, 1);
    return function() {
        fn.apply(oThis, args.concat(aProto.slice.call(arguments)));
    };
});

function isPromise(smth) {
    return smth && typeof(smth.then) === "function";
}

var CONTINUE = {};
var TaskBuilder = function() {
    this.machine = null;
    this.handlers = null;
    this.promise = Vow.promise();
    this.promise.abort = bind.call(this.abort, this);
    this.exited = false;

    this.onThen = bind.call(this.moveNext, this);
    this.onError = bind.call(this.setException, this);
    this.CONT = CONTINUE;
};
TaskBuilder.prototype.run = function(machine, handlers) {
    this.machine = machine;
    this.handlers = handlers;
    this.moveNext();
    return this.promise;
};
TaskBuilder.prototype.ret = function(result) {
    if (this.exited)
        throw "Internal error: this method already exited";
    this.exited = true;
    this.promise.fulfill(result);
};
TaskBuilder.prototype.setException = function(ex) {
    if (this.handlers && this.handlers(ex) === CONTINUE) {
        this.moveNext();
        return;
    }
    this.promise.reject(ex);
};
TaskBuilder.prototype.abort = function(ex) {
    this.exited = true;
    this.promise.reject(ex);
};
TaskBuilder.prototype.moveNext = function() {
    var result = CONTINUE;
    while (!this.exited && result === CONTINUE) {
        try {
            result = this.machine();
        } catch (ex) {
            this.setException(ex);
            return;
        }
        if (isPromise(result)) {
            result.then(this.onThen, this.onError);
            return;
        } else if (result !== CONTINUE && !this.exited) {
            this.setException("Awaited value is not a promise: " + result);
            return;
        }
    }
};
//#end

module.exports.TaskBuilder = TaskBuilder;
