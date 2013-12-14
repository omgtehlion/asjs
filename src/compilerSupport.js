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
function isPromise(smth) {
    return smth && typeof(smth.then) === "function";
}

var CONTINUE = {};
/* this method is called from generated code */
var TaskBuilder = function() {
    // primary state machine
    this.machine = null;
    // exception handler mapper
    this.handlers = null;
    // a promise, returned by generated function
    this.promise = Vow.promise();
    // expose a public interface
    this.promise.abort = function() { self.abort(); };
    // true, when this method finished execution
    this.exited = false;
    // fulfillment value of awaited promise
    this.val = undefined;

    this.CONT = CONTINUE;
};
/* this method is called from generated code */
TaskBuilder.prototype.run = function(machine, handlers) {
    this.machine = machine;
    this.handlers = handlers;
    this.moveNext();
    return this.promise;
};
/* this method is called from generated code */
TaskBuilder.prototype.ret = function(result) {
    if (this.exited)
        throw "Internal error: this method already exited";
    this.promise.fulfill(result);
    this.dispose();
};
/* private */
TaskBuilder.prototype.setException = function(ex) {
    if (this.handlers && this.handlers(ex) === CONTINUE) {
        this.moveNext();
    } else {
        this.promise.reject(ex);
        this.dispose();
    }
};
/* private */
TaskBuilder.prototype.dispose = function() {
    this.exited = true;
    this.machine = null;
    this.handlers = null;
    this.val = undefined;
};
/* public */
TaskBuilder.prototype.abort = function(ex) {
    this.promise.reject(ex);
    this.dispose();
};
/* private */
TaskBuilder.prototype.onFulfill = function (val) {
    this.val = val;
    this.moveNext();
};
/* private */
TaskBuilder.prototype.onReject = TaskBuilder.prototype.setException;
/* private */
TaskBuilder.prototype.moveNext = function() {
    var result = CONTINUE;
    while (!this.exited && result === CONTINUE) {
        try {
            result = this.machine();
        } catch (ex) {
            this.setException(ex);
            break;
        }
        if (isPromise(result)) {
            // NOTE: Vow-js specific state checking
            if (result._isFulfilled) {
                this.val = result.valueOf();
                result = CONTINUE;
            } else {
                this.val = undefined;
                // NOTE: Vow-js specific context-passing
                result.then(this.onFulfill, this.onReject, undefined, this);
                break;
            }
        } else if (result !== CONTINUE && !this.exited) {
            this.setException("Awaited value is not a promise: " + result);
            break;
        }
    }
};
//#end

module.exports.TaskBuilder = TaskBuilder;
