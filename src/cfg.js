//
// https://github.com/omgtehlion/asjs
//
// Authors:
//   Anton A. Drachev (anton@drachev.com)
//
// Licensed under the terms of BSD 2-Clause License.
// See license.txt file for the full text of the license.
//

var utils = require("./utils");
var TempVar = utils.TempVar;
var ARE_YOU_MAD = utils.ARE_YOU_MAD;
var COME_LATER = utils.COME_LATER;
var DA_FUK_IS_THAT = utils.DA_FUK_IS_THAT;

//////////////////////////////////////
// Tools
//
var isAwait = function(node) {
    return node.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === "await";
};
var getAwaited = function(node) {
    node.arguments[0].isAwaited = true;
    return node.arguments[0];
};
var breaksFlow = function(expr) {
    var result = false;
    utils.traverse(expr, {
        enter: function(node) {
            if (node.type === "FunctionExpression" || node.type === "FunctionDeclaration") {
                // HACK HACK HACK: skip inline functions
                return utils.Skip;
            }
            if (node.type === "ReturnStatement"
                || node.type === "BreakStatement"
                || node.type === "ContinueStatement"
                || isAwait(node)) {
                result = true;
                return utils.Break;
            }
        }
    });
    return result;
};

//////////////////////////////////////////
// call-flow graph
//
var CfgNode = function(cfg, astNode) {
    if (!(cfg instanceof Cfg))
        throw "cannot create CfgNode directly";
    // usual nodes have .node and .next
    this.node = astNode;
    this.next = -1;
    // if-nodes have .test and .next and .alternate
    this.test = undefined;
    this.alternate = -1;

    this.goAlternate = false;

    this.prev = [];
    this.isAwaited = !!(astNode && astNode.isAwaited);
    this.tryHandler = -1;
    this.returns = undefined;
};
var Cfg = function() {
    this.cfg = [];
    this.currHandler = -1;
    this.handlers = [];
    this.breakStack = [];
};
Cfg.prototype.newNode = function(astNode) {
    var result = new CfgNode(this, astNode);
    result.id = this.cfg.length;
    this.cfg.push(result);
    result.tryHandler = this.currHandler;
    return result;
};
Cfg.prototype.get = function(id) {
    return this.cfg[id];
};
Cfg.prototype.pushHandler = function(handlerId) {
    this.handlers.push(this.currHandler);
    this.currHandler = handlerId;
};
Cfg.prototype.popHandler = function() {
    this.currHandler = this.handlers.pop();
};
/* returns child node */
Cfg.prototype.connect = function(child, parent) {
    if (parent !== null) {
        child.prev.push(parent.id);
        if (parent.goAlternate) {
            if (parent.alternate !== -1)
                throw DA_FUK_IS_THAT;
            parent.alternate = child.id;
            parent.goAlternate = false;
        } else {
            if (parent.next !== -1)
                throw DA_FUK_IS_THAT;
            parent.next = child.id;
        }
    }
    return child;
};
Cfg.prototype.getBreakTarget = function(node) {
    var breakObj;
    var breakStack = this.breakStack;
    if (node.label) {
        if (node.label.type !== "Identifier")
            throw ARE_YOU_MAD;
        for (var i = breakStack.length; i-- > 0;) {
            if (breakStack[i].label === node.label.name) {
                breakObj = breakStack[i];
                break;
            }
        }
    } else {
        breakObj = breakStack[breakStack.length - 1];
    }
    if (!breakObj) {
        throw "Cannot find where to break";
    }
    var mappedType = { "BreakStatement": "breakTo", "ContinueStatement": "continueTo" }[node.type];
    return breakObj[mappedType];
};

//////////////////////////////////////////////
// Call-flow graph builder
//
var CfgBuilder = function(scope) {
    this.scope = scope;
    this.cfg = new Cfg();
    this.currNode = this.cfg.newNode(null);
    this.currHandler = -1;
};
/** @private */
CfgBuilder.prototype.remapParam = function(handler) {
    // HACK HACK HACK
    handler.body.body.unshift({
        "type": "VariableDeclaration",
        "declarations": [{
            "type": "VariableDeclarator",
            "id": handler.param,
            "init": { "type": "Identifier", "name": this.scope.getSpec("ex") }
        }],
        "kind": "var"
    });
};
/** @private */
CfgBuilder.prototype.traverseReplacing = function(node, field, thisNode) {
    if (!thisNode)
        throw DA_FUK_IS_THAT;
    var tmpVar = new TempVar(thisNode.id);
    if (this.traverse(node[field], tmpVar) !== false)
        node[field] = tmpVar;
};
/** @private */
CfgBuilder.prototype.traverse = function(node, asTmp) {
    var cfg = this.cfg;

    switch (node.type) {
        case "BlockStatement":
            for (var i = 0; i < node.body.length; i++)
                if (node.body[i] !== null) // skip removed statements
                    this.traverse(node.body[i]);
            return false;
        case "ExpressionStatement":
            this.traverse(node.expression);
            return false;
        case "ReturnStatement":
            // adding an empty node, just a safety measure
            var thisNode = cfg.newNode(null);
            if (node.argument) {
                this.traverseReplacing(node, "argument", thisNode);
                thisNode.returns = node.argument;
            } else {
                thisNode.returns = { type: "Identifier", name: "undefined" };
            }
            cfg.connect(thisNode, this.currNode);
            this.currNode = null;
            return false;
        case "TryStatement":
            if (node.guardedHandlers.length !== 0)
                throw ARE_YOU_MAD;
            if (node.handlers.length !== 1)
                throw ARE_YOU_MAD;
            if (node.finalizer)
                throw COME_LATER;

            var exitNode = cfg.newNode(null);
            var entryNode = this.currNode;

            // process handler
            var handler = cfg.newNode(null);
            this.currNode = handler;
            this.remapParam(node.handlers[0]);
            this.traverse(node.handlers[0].body);
            cfg.connect(exitNode, this.currNode);

            // process body
            cfg.pushHandler(handler.id);
            this.currNode = entryNode;
            this.traverse(node.block);
            cfg.popHandler();
            cfg.connect(exitNode, this.currNode);

            this.currNode = exitNode;
            return false;
        case "LabeledStatement":
            if (["WhileStatement", "DoWhileStatement", "ForStatement"].indexOf(node.body.type) === -1)
                throw ARE_YOU_MAD;
            if (node.label.type !== "Identifier")
                throw ARE_YOU_MAD;
            node.body.__label = node.label.name;
            this.traverse(node.body);
            return false;
        case "BreakStatement":
        case "ContinueStatement":
            if (node.label && node.label.type !== "Identifier")
                throw ARE_YOU_MAD;
            var target = cfg.getBreakTarget(node);
            cfg.connect(target, this.currNode);
            this.currNode = cfg.newNode(null);
            return false;
        case "Identifier":
        case "Literal":
            if (!node.isAwaited && (!asTmp || !asTmp.__forced))
                return false;
            break;
        case "FunctionDeclaration":
            // declared functions don't participate in control flow
            return false;
    }

    if (isAwait(node)) {
        this.traverse(getAwaited(node), asTmp);
        return;
    }

    if (!breaksFlow(node)) {
        var thisNode = cfg.newNode(node);
        this.currNode = cfg.connect(thisNode, this.currNode);
        if (asTmp)
            this.currNode.tmp = asTmp;
        return;
    }

    switch (node.type) {
        case "IfStatement":
            // ---> | if (test) | ---> | consequent......... | ---> | *exitNode | ---> (exit)
            //      | *testNode | ---> | alternate, optional | ---> |           |
            if (breaksFlow(node.test))
                throw ARE_YOU_MAD;
            if (asTmp)
                throw DA_FUK_IS_THAT;

            // setup testNode and exitNode
            var testNode = cfg.connect(cfg.newNode(null), this.currNode);
            testNode.test = node.test;
            var exitNode = cfg.newNode(null);

            this.currNode = testNode;
            this.traverse(node.consequent);
            cfg.connect(exitNode, this.currNode);

            this.currNode = testNode;
            this.currNode.goAlternate = true;
            if (node.alternate)
                this.traverse(node.alternate);
            cfg.connect(exitNode, this.currNode);

            this.currNode = exitNode;
            return false;
        case "WhileStatement":
            //            v--------------------------\
            // ---> | if (test) | ---> | body... | --/
            //      | *testNode | ----------------------> | *exitNode | ---> (exit)
            // break -> exitNode
            // continue -> testNode
            if (breaksFlow(node.test))
                throw ARE_YOU_MAD;
            if (asTmp)
                throw DA_FUK_IS_THAT;

            // setup testNode
            var testNode = cfg.newNode(null);
            testNode.test = node.test;
            this.currNode = cfg.connect(testNode, this.currNode);
            var exitNode = cfg.newNode(null);

            cfg.breakStack.push({ label: node.__label, breakTo: exitNode, continueTo: testNode });

            this.traverse(node.body);
            cfg.connect(testNode, this.currNode);

            testNode.goAlternate = true;
            this.currNode = cfg.connect(exitNode, testNode);

            cfg.breakStack.pop();
            return false;
        case "DoWhileStatement":
            //          v-----------------------------\
            // ---> | *body... | ---> | if (test) | --/
            //                        | *testNode | ----> | *exitNode | ---> (exit)
            // break -> exitNode
            // continue -> body
            if (breaksFlow(node.test))
                throw ARE_YOU_MAD;
            if (asTmp)
                throw DA_FUK_IS_THAT;

            var exitNode = cfg.newNode(null);
            var body = cfg.connect(cfg.newNode(null), this.currNode);

            cfg.breakStack.push({ label: node.__label, breakTo: exitNode, continueTo: body });

            this.currNode = body;
            this.traverse(node.body);

            var testNode = cfg.connect(cfg.newNode(null), this.currNode);
            testNode.test = node.test;
            cfg.connect(body, testNode);

            testNode.goAlternate = true;
            this.currNode = cfg.connect(exitNode, testNode);

            cfg.breakStack.pop();
            return false;
        case "ForStatement":
            //                          v-----------------------------------------------\
            // ---> | init | ---> | if (test) | ---> | body... | ---> | *updateNode | --/
            //                    | *testNode | --\
            //                                     \--> | *exitNode | ---> (exit)
            // break -> exitNode
            // continue -> updateNode
            if (node.test && breaksFlow(node.test))
                throw ARE_YOU_MAD
            if (asTmp)
                throw DA_FUK_IS_THAT;

            if (node.init)
                this.traverse(node.init);

            var testNode = cfg.newNode(null);
            if (node.test)
                testNode.test = node.test;
            cfg.connect(testNode, this.currNode);
            var exitNode = cfg.newNode(null);
            var updateNode = cfg.newNode(null);

            cfg.breakStack.push({ label: node.__label, breakTo: exitNode, continueTo: updateNode });

            this.currNode = testNode;
            this.traverse(node.body);
            this.currNode = cfg.connect(updateNode, this.currNode);
            if (node.update)
                this.traverse(node.update);
            cfg.connect(testNode, this.currNode);

            if (node.test) {
                testNode.goAlternate = true;
                cfg.connect(exitNode, testNode);
            }
            this.currNode = exitNode;

            cfg.breakStack.pop();
            return false;
        case "ConditionalExpression":
            // copy-paste from IfStatement
            if (breaksFlow(node.test))
                throw ARE_YOU_MAD;

            // setup testNode and exitNode
            var testNode = cfg.connect(cfg.newNode(null), this.currNode);
            testNode.test = node.test;
            var exitNode = cfg.newNode(null);

            // this tempVar cannot be inlined
            if (asTmp)
                asTmp.__forced = true;

            this.currNode = testNode;
            this.traverse(node.consequent, asTmp);
            // safety stub
            this.currNode = cfg.connect(cfg.newNode(null), this.currNode);
            cfg.connect(exitNode, this.currNode);

            this.currNode = testNode;
            this.currNode.goAlternate = true;
            this.traverse(node.alternate, asTmp);
            // safety stub
            this.currNode = cfg.connect(cfg.newNode(null), this.currNode);
            cfg.connect(exitNode, this.currNode);

            this.currNode = exitNode;
            return;
        case "LogicalExpression":
            if (!asTmp)
                asTmp = new TempVar(this.currNode.id);
            asTmp.__forced = true;

            this.traverse(node.left, asTmp);
            // safety stub
            this.currNode = cfg.connect(cfg.newNode(null), this.currNode);

            var testNode = cfg.connect(cfg.newNode(null), this.currNode);
            testNode.test = asTmp;
            this.currNode = testNode;

            if (node.operator === "&&") {
                this.traverse(node.right, asTmp);
                testNode.goAlternate = true;
            } else if (node.operator === "||") {
                testNode.goAlternate = true;
                this.traverse(node.right, asTmp);
            } else {
                throw COME_LATER;
            }
            var exitNode = cfg.connect(cfg.newNode(null), testNode);
            // safety stub
            this.currNode = cfg.connect(cfg.newNode(null), this.currNode);
            this.currNode = cfg.connect(exitNode, this.currNode);
            return;
        case "SwitchStatement":
            // --> | $1 = discr |-\
            //                     |
            //                     v
            //          | ($1 == test1) | -else-> | ($1 == test2) | -else->....-else-------\
            //                    \                         \                               \
            //                     | case1 body...... | ---> | case2 body...... | --> ...--> | default body |
            //                            \                                                                 /
            //                             \                                                  /------------/
            //                              \-breaks to--> .................................. | exitNode | --> (exit)

            // save entry node for later
            var entryNode = this.currNode;
            // setup break and continue
            var exitNode = cfg.newNode(null);
            cfg.breakStack.push({ label: node.__label, breakTo: exitNode, continueTo: null });
            // iterate through case bodies
            var caseBodies = new Array(node.cases.length);
            var defaultBody = null;
            this.currNode = cfg.newNode(null);
            for (var i = 0; i < node.cases.length; i++) {
                var c = node.cases[i];
                // if previous statement exited with return
                if (!this.currNode)
                    this.currNode = cfg.newNode(null);
                var cb = this.currNode; // previous to case body
                this.traverse({ type: "BlockStatement", body: c.consequent });
                cb = cfg.get(cb.next);
                if (!cb) {
                    // safety stub
                    this.currNode = cfg.connect(cfg.newNode(null), this.currNode);
                    cb = this.currNode;
                }
                if (c.test !== null)
                    caseBodies[i] = cb;
                else
                    defaultBody = cb;
            }
            if (this.currNode) {
                // exit from last node
                cfg.connect(exitNode, this.currNode);
            }
            if (!defaultBody) {
                // if we dont have default, exit right away:
                defaultBody = exitNode;
            }
            // save discriminant to a temp var
            this.currNode = entryNode;
            var tmpVar = new TempVar(this.currNode.id);
            tmpVar.__forced = true;
            this.traverse(node.discriminant, tmpVar);
            for (var i = 0; i < node.cases.length; i++) {
                var c = node.cases[i];
                if (c.test === null)
                    continue;
                // test $tmpVar === case[i]
                var testNode = cfg.connect(cfg.newNode(null), this.currNode);
                testNode.test = { type: "BinaryExpression", operator: "===", left: tmpVar, right: c.test };
                var cb = caseBodies[i];
                cfg.connect(cb, testNode);
                testNode.goAlternate = true;
                this.currNode = testNode;
            }
            // connect default case (or exit node)
            cfg.connect(defaultBody, this.currNode);
            // return break stack
            cfg.breakStack.pop();
            // return node
            this.currNode = exitNode;
            return;
    }

    var thisNode = cfg.newNode(node);
    switch (node.type) {
        case "BinaryExpression":
            this.traverseReplacing(node, "left", thisNode);
            this.traverseReplacing(node, "right", thisNode);
            break;
        case "AssignmentExpression":
            if (breaksFlow(node.left))
                throw ARE_YOU_MAD;
            this.traverseReplacing(node, "right", thisNode);
            break;
        case "CallExpression":
            if (breaksFlow(node.callee)) {
                if (node.callee.type === "MemberExpression") {
                    this.traverseReplacing(node.callee, "object", thisNode);
                    this.traverseReplacing(node.callee, "property", thisNode);
                } else {
                    this.traverseReplacing(node, "callee", thisNode);
                }
            }
            for (var i = 0; i < node.arguments.length; i++)
                this.traverseReplacing(node.arguments, i, thisNode);
            break;
        case "MemberExpression":
            this.traverseReplacing(node, "object", thisNode);
            this.traverseReplacing(node, "property", thisNode);
            break;
        case "ArrayExpression":
            for (var i = 0; i < node.elements.length; i++)
                this.traverseReplacing(node.elements, i, thisNode);
            break;
        case "ObjectExpression":
            for (var i = 0; i < node.properties.length; i++)
                this.traverseReplacing(node.properties[i], "value", thisNode);
            return false; // HACK HACK HACK
        case "Identifier":
        case "Literal":
            break;
        case "WithStatement":
            throw ARE_YOU_MAD;
        default:
            throw COME_LATER + ", node type: " + node.type;
    }
    this.currNode = cfg.connect(thisNode, this.currNode);
    this.currNode.tmp = asTmp;
};

module.exports.build = function(workingSet) {
    var cfgBuilder = new CfgBuilder(workingSet.scope);
    cfgBuilder.traverse(workingSet.ast.body);
    workingSet.cfg = cfgBuilder.cfg;
};
