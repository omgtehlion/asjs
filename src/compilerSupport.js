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
    this.deferred = Vow.defer();
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
    this.next();
    return this.deferred.promise();
};
/* this method is called from generated code */
TaskBuilder.prototype.ret = function(result) {
    if (this.exited)
        throw "Internal error: this method already exited";
    this.deferred.resolve(result);
    this.dispose();
};
/* private */
TaskBuilder.prototype.setException = function(ex) {
    if (this.handlers && this.handlers(ex) === CONTINUE) {
        this.next();
    } else {
        this.deferred.reject(ex);
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
/* private */
TaskBuilder.prototype.onFulfill = function(val) {
    this.val = val;
    this.next();
};
/* private */
TaskBuilder.prototype.onReject = TaskBuilder.prototype.setException;
/* private */
TaskBuilder.prototype.setupThen = function(promise) {
    var self = this;
    promise.then(function(val) { self.onFulfill(val); }, function(ex) { self.onReject(ex); });
};
/* private */
TaskBuilder.prototype.next = function() {
    var result = CONTINUE;
    while (!this.exited && result === CONTINUE) {
        try {
            result = this.machine();
        } catch (ex) {
            this.setException(ex);
            break;
        }
        this.val = undefined;
        if (result instanceof Vow.Promise) {
            // Vow-js specific state checking
            if (result.isFulfilled()) {
                this.val = result.valueOf();
                result = CONTINUE;
            } else {
                // Vow-js specific context-passing
                result.then(this.onFulfill, this.onReject, undefined, this);
                break;
            }
        } else if (isPromise(result)) {
            this.setupThen(result);
            break;
        } else if (result !== CONTINUE && !this.exited) {
            this.setException("Awaited value is not a promise: " + result);
            break;
        }
    }
};
//#end

module.exports.TaskBuilder = TaskBuilder;
