//
// https://github.com/omgtehlion/asjs
//
// Authors:
//   Anton A. Drachev (anton@drachev.com)
//
// Licensed under the terms of BSD 2-Clause License.
// See license.txt file for the full text of the license.
//

var cfg = require("./cfg");
var tmpl = require("./templates");
var utils = require("./utils");
var DA_FUK_IS_THAT = utils.DA_FUK_IS_THAT;
var TempVar = utils.TempVar;

//////////////////////////////////////////////
// Consolidated synchronous blocks
//
var SyncBlock = function(blocks) {
    this.id = blocks.length;
    this.ignored = false;
    this.statements = [];
    blocks.push(this);
};

//////////////////////////////////////////////
// Chopping funcs
//
var statementFromNode = function(seqNode) {
    var expr = seqNode.node;
    if (/(Statement|Declaration)$/.test(expr.type)) {
        if (seqNode.tmp)
            throw DA_FUK_IS_THAT;
        return expr;
    }
    if (seqNode.tmp)
        expr = tmpl.assign(seqNode.tmp, expr);
    return tmpl.expression(expr);
};
var traverseAlloc = function(ws, node) {
    var cfg = ws.cfg;
    var scope = ws.scope;
    if ("block" in node)
        return ws.blocks[node.block];
    var block = new SyncBlock(ws.blocks);
    node.block = block.id;
    var seedHandler = node.tryHandler;
    if (seedHandler !== -1) {
        block.tryHandler = traverseAlloc(ws, cfg.get(seedHandler));
        ws.handlers[block.id] = block.tryHandler.id;
    }

    while (node) {
        if (node.tryHandler !== seedHandler) {
            var nextBlk = traverseAlloc(ws, node);
            block.statements.push(tmpl.setState(scope, nextBlk.id));
            block.statements.push(tmpl.returnContinue(scope));
            return block;
        }

        if (node.test) {
            var traverseBranch = function(branch) {
                var blk = traverseAlloc(ws, branch);
                if (branch.prev.length === 1) {
                    blk.ignored = true;
                    return blk.statements;
                } else {
                    return [tmpl.setState(scope, blk.id), tmpl.returnContinue(scope)];
                }
            };
            var conseq = traverseBranch(cfg.get(node.next));
            var altern = traverseBranch(cfg.get(node.alternate));
            block.statements.push(tmpl.ifStmt(node.test, conseq, altern));
            return block;
        }

        if (node.isAwaited) {
            var awaitingBlk;
            if (node.next === -1) {
                // await() is the last statement
                // prepare an exit block
                awaitingBlk = new SyncBlock(ws.blocks);
                awaitingBlk.tryHandler = block.tryHandler;
                awaitingBlk.statements.push(tmpl.setState(scope, -1));
                awaitingBlk.statements.push(tmpl.fulfill(scope, undefined));
                awaitingBlk.statements.push(tmpl.break());
            } else {
                awaitingBlk = traverseAlloc(ws, cfg.get(node.next));
            }
            block.statements.push(tmpl.setState(scope, awaitingBlk.id));
            block.statements.push(tmpl.return(node.node));
            if (node.tmp)
                awaitingBlk.statements.unshift(tmpl.awaitedToTmpVar(scope, node.tmp));
            return block;
        }

        var next = cfg.get(node.next);

        if (node.node)
            block.statements.push(statementFromNode(node));

        if (!next) {
            if (node.next !== -1)
                throw DA_FUK_IS_THAT;
            block.statements.push(tmpl.setState(scope, -1));
            block.statements.push(tmpl.fulfill(scope, node.returns));
            block.statements.push(tmpl.break());
            return block;
        }

        if (next.prev.length > 1) {
            var nextBlk = traverseAlloc(ws, next);
            block.statements.push(tmpl.setState(scope, nextBlk.id));
            block.statements.push(tmpl.returnContinue(scope));
            return block;
        }

        node = next;
    }
};
var chopBlocks = function(ws) {
    traverseAlloc(ws, ws.cfg.get(0));
};
var allocTempVars = function(ws) {
    var scope = ws.scope;
    var traverse = function(expr) {
        if (!expr)
            return;
        utils.traverse(expr, {
            enter: function(node) {
                if ((node instanceof TempVar) && !node.type) {
                    // assign a new name
                    node.type = "Identifier";
                    node.name = scope.getTempVar();
                }
            }
        });
    };
    ws.blocks.forEach(function(block) { block.statements.forEach(traverse); });
};
var hoistFuncDecls = function(ws) {
    var declaredFuncs = [];
    utils.replace(ws.ast.body, {
        enter: function(node, parent) {
            if (node.type === "FunctionDeclaration") {
                ws.declaredFuncs.push(node);
                return null;
            }
        }
    });
};

module.exports.process = function(workingSet) {
    if (workingSet.cfg)
        throw "cannot reuse this object";
    hoistFuncDecls(workingSet);
    cfg.build(workingSet);
    chopBlocks(workingSet);
    allocTempVars(workingSet);
};
