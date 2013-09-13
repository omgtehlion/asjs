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
    var self = this;

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

    this.onFulfill = function(val) {
        self.val = val;
        self.moveNext();
    };
    this.onReject = function(err) { self.setException(err); };
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
    this.exited = true;
    this.dispose();
    this.promise.fulfill(result);
};
/* private */
TaskBuilder.prototype.setException = function(ex) {
    if (this.handlers && this.handlers(ex) === CONTINUE)
        this.moveNext();
    else
        this.promise.reject(ex);
};
/* private */
TaskBuilder.prototype.dispose = function() {
    this.machine = null;
    this.handlers = null;
    this.val = undefined;
};
/* public */
TaskBuilder.prototype.abort = function(ex) {
    this.exited = true;
    this.promise.reject(ex);
};
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
            if (result._isFulfilled) {
                this.val = result.valueOf();
                result = CONTINUE;
            } else {
                result.then(this.onFulfill, this.onReject);
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
