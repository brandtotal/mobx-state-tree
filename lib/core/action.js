"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var factories_1 = require("./factories");
var top_level_api_1 = require("../top-level-api");
var utils_1 = require("../utils");
var node_1 = require("./node");
function createNonActionWrapper(instance, key, func) {
    utils_1.addHiddenFinalProp(instance, key, func.bind(instance));
}
exports.createNonActionWrapper = createNonActionWrapper;
function createActionWrapper(instance, key, action) {
    utils_1.addHiddenFinalProp(instance, key, function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var adm = node_1.getNode(instance);
        var runAction = function () {
            return action.apply(instance, args);
        };
        if (adm.isRunningAction()) {
            // an action is already running in this tree, invoking this action does not emit a new action
            return runAction();
        }
        else {
            // start the action!
            var root = adm.root;
            root._isRunningAction = true;
            try {
                return adm.emitAction(adm, {
                    name: key,
                    path: "",
                    args: args.map(function (arg, index) { return serializeArgument(adm, key, index, arg); })
                }, runAction);
            }
            finally {
                root._isRunningAction = false;
            }
        }
    });
}
exports.createActionWrapper = createActionWrapper;
function serializeArgument(adm, actionName, index, arg) {
    if (utils_1.isPrimitive(arg))
        return arg;
    if (factories_1.isModel(arg)) {
        var targetNode = node_1.getNode(arg);
        if (adm.root !== targetNode.root)
            throw new Error("Argument " + index + " that was passed to action '" + actionName + "' is a model that is not part of the same state tree. Consider passing a snapshot or some representative ID instead");
        return ({
            $ref: node_1.getRelativePath(adm, node_1.getNode(arg))
        });
    }
    if (typeof arg === "function")
        throw new Error("Argument " + index + " that was passed to action '" + actionName + "' should be a primitive, model object or plain object, received a function");
    if (typeof arg === "object" && !utils_1.isPlainObject(arg))
        throw new Error("Argument " + index + " that was passed to action '" + actionName + "' should be a primitive, model object or plain object, received a " + ((arg && arg.constructor) ? arg.constructor.name : "Complex Object"));
    if (mobx_1.isObservable(arg))
        throw new Error("Argument " + index + " that was passed to action '" + actionName + "' should be a primitive, model object or plain object, received an mobx observable.");
    try {
        // Check if serializable, cycle free etc...
        // MWE: there must be a better way....
        JSON.stringify(arg); // or throws
        return arg;
    }
    catch (e) {
        throw new Error("Argument " + index + " that was passed to action '" + actionName + "' is not serializable.");
    }
}
function deserializeArgument(adm, value) {
    if (typeof value === "object") {
        var keys = Object.keys(value);
        if (keys.length === 1 && keys[0] === "$ref")
            return top_level_api_1.resolve(adm.target, value.$ref);
    }
    return value;
}
function applyActionLocally(node, instance, action) {
    utils_1.invariant(typeof instance[action.name] === "function", "Action '" + action.name + "' does not exist in '" + node.path + "'");
    instance[action.name].apply(instance, action.args ? action.args.map(function (v) { return deserializeArgument(node, v); }) : []);
}
exports.applyActionLocally = applyActionLocally;
//# sourceMappingURL=action.js.map