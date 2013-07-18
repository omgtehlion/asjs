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

function isPromise(smth) {
    return smth && typeof(smth.then) === "function";
}

var CONTINUE = {};
var TaskBuilder = function() {
    this.machine = null;
    this.handlers = null;
    this.promise = Vow.promise();
    this.promise.abort = this.abort.bind(this);
    this.exited = false;

    this.onThen = this.moveNext.bind(this);
    this.onError = this.setException.bind(this);
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

module.exports.CONTINUE = CONTINUE;
module.exports.TaskBuilder = TaskBuilder;
