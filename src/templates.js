//
// https://github.com/omgtehlion/asjs
//
// Authors:
//   Anton A. Drachev (anton@drachev.com)
//
// Licensed under the terms of BSD 2-Clause License.
// See license.txt file for the full text of the license.
//

var Tmpl = {};

// these does not need scope
Tmpl.expression = function(expression) {
    return { type: "ExpressionStatement", expression: expression };
};
Tmpl.return = function(expression) {
    return { type: "ReturnStatement", argument: expression };
};
Tmpl.assign = function(left, right) {
    return { type: "AssignmentExpression", operator: "=", left: left, right: right };
};
Tmpl.assignStmt = function(left, right) {
    return this.expression(this.assign(left, right));
};
Tmpl.number = function(i) {
    if (i >= 0)
        return { type: "Literal", value: i };
    return { type: "UnaryExpression", operator: "-", prefix: true, argument: { type: "Literal", value: -i } };
};
Tmpl.member = function(obj, prop) {
    return { type: "MemberExpression", computed: false, object: { type: "Identifier", name: obj }, property: { type: "Identifier", name: prop } };
};
Tmpl.call = function(callee, args) {
    return { type: "CallExpression", callee: callee, arguments: args || [] };
};
Tmpl.callNew = function(callee, args) {
    return { type: "NewExpression", callee: callee, arguments: args || [] };
};
Tmpl.ifStmt = function(test, conseq, altern) {
    function arr(x) { return (Array.isArray(x) ? x : [x]); }
    conseq = conseq ? arr(conseq) : [];
    altern = altern && arr(altern);
    // special else-if treatment
    if (altern && altern.length === 1 && altern[0].type === "IfStatement") {
        conseq = this.block(conseq);
        altern = altern[0];
    } else {
        // force braces if needed
        if (conseq.length !== 1 || (altern && altern.length > 1)) {
            conseq = this.block(conseq);
            if (altern)
                altern = this.block(altern);
        } else {
            conseq = conseq[0];
            if (altern)
                altern = altern[0];
        }
    }
    var result = { type: "IfStatement", test: test, consequent: conseq };
    if (altern)
        result.alternate = altern;
    return result;
};
Tmpl.break = function(label) {
    if (typeof (label) === "undefined")
        label = null;
    return { type: "BreakStatement", label: label };
};
Tmpl.block = function(statements) {
    return { type: "BlockStatement", body: statements };
};
Tmpl.func = function(params, statements) {
    params = params.map(function(name) { return { type: "Identifier", name: name }; });
    return { type: "FunctionExpression", id: null, params: params, defaults: [], body: this.block(statements) };
};
Tmpl.var = function(name, init) {
    if (typeof (init) === "undefined")
        init = null;
    return { type: "VariableDeclarator", id: { type: "Identifier", name: name }, init: init };
};
Tmpl.vars = function(vars) {
    vars = vars.map(function(v) { return this.var(v.name, v.init); }, this);
    return { type: "VariableDeclaration", declarations: vars, kind: "var" };
};
Tmpl.throw = function(literal) {
    return { type: "ThrowStatement", argument: { type: "Literal", value: literal } };
};
Tmpl.require = function(localName, fileName) {
    var args = [{ type: "Literal", value: fileName }];
    return this.vars([{ name: localName, init: this.call({ type: "Identifier", name: "require" }, args) }]);
};

// these need scope
Tmpl.setState = function(scope, state) {
    return this.assignStmt({ type: "Identifier", name: scope.getSpec("state") }, this.number(state));
};
Tmpl.awaiterToTmpVar = function(scope, tmpVar) {
    return this.assignStmt(tmpVar, this.call(this.member(scope.getSpec("awaiter"), "valueOf")));
};
Tmpl.returnAwaiter = function(scope, expr) {
    return this.return(this.assign({ type: "Identifier", name: scope.getSpec("awaiter") }, expr));
};
Tmpl.returnContinue = function(scope) {
    return this.return({ type: "Identifier", name: scope.getSpec("continue") });
};
Tmpl.fulfill = function(scope, value) {
    var builderRet = this.member(scope.getSpec("builder"), "ret");
    if (value && value.type === "Identifier" && value.name === "undefined")
        value = undefined;
    return this.expression(this.call(builderRet, value ? [value] : []));
};

module.exports = Tmpl;