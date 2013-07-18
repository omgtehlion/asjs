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

module.exports = function(workingSet) {
    var body = [];
    var scope = workingSet.scope;
    var taskBld = tmpl.member(workingSet.compilerSupport, "TaskBuilder");

    // declare internal variables
    body.push(tmpl.vars([
        { name: scope.getSpec("builder"), init: tmpl.callNew(taskBld) },
        { name: scope.getSpec("state"), init: tmpl.number(0) },
        { name: scope.getSpec("awaiter") },
        { name: scope.getSpec("continue"), init: tmpl.member(scope.getSpec("builder"), "CONT") },
        { name: scope.getSpec("ex") }
    ]));

    // remapped identifiers
    if (scope.remapped.count() > 0) {
        var remapped = scope.remapped.map(function(key, value) {
            return { name: value, init: { type: "Identifier", name: key } };
        });
        body.push(tmpl.vars(remapped));
    }

    // temporary variables
    if (scope.tempVars.length > 0) {
        var tempVars = scope.tempVars.map(function(name) { return { name: name }; });
        body.push(tmpl.vars(tempVars));
    }

    // declare user’s variables
    if (scope.locals.count() > 0) {
        var locals = scope.locals.keys().map(function(name) { return { name: name }; });
        body.push(tmpl.vars(locals));
    }

    // state machine itself
    var cases = workingSet.blocks.filter(function(b) { return !b.ignored; }).map(function(block) {
        return { type: "SwitchCase", test: tmpl.number(block.id), consequent: [tmpl.block(block.statements)] };
    });
    cases.push({
        type: "SwitchCase",
        test: null,
        consequent: [tmpl.throw("Internal error: encountered wrong state")]
    });
    var machines = [];
    // main machine
    machines.push(tmpl.func([], [{
        type: "SwitchStatement",
        discriminant: { type: "Identifier", name: scope.getSpec("state") },
        cases: cases
    }]));
    // exception handling machine
    if (workingSet.handlers.length > 0) {
        var handlersMap = {
            type: "ArrayExpression",
            elements: workingSet.handlers.map(function(h) { return (h !== undefined) ? tmpl.number(h) : null; })
        };
        var declHandler = tmpl.vars([{
            name: "handler",
            init: {
                type: "MemberExpression",
                computed: true,
                object: handlersMap,
                property: { type: "Identifier", name: scope.getSpec("state") }
            }
        }]);
        var ifStmt = tmpl.ifStmt({
            type: "BinaryExpression",
            operator: "!==",
            left: { type: "Identifier", name: "handler" },
            right: { type: "Identifier", name: "undefined" }
        }, [
            tmpl.assignStmt({ type: "Identifier", name: scope.getSpec("state") }, { type: "Identifier", name: "handler" }),
            tmpl.assignStmt({ type: "Identifier", name: scope.getSpec("ex") }, { type: "Identifier", name: "ex" }),
            tmpl.returnContinue(scope)
        ]);
        machines.push(tmpl.func(["ex"], [declHandler, ifStmt]));
    }

    // run builder and return a promise
    var builderRun = tmpl.call(tmpl.member(workingSet.scope.getSpec("builder"), "run"), machines);
    body.push(tmpl.return(builderRun));

    // declare all funcs
    workingSet.declaredFuncs.forEach(function(node) { body.push(node); });

    // replace body
    workingSet.ast.body = tmpl.block(body);
};
