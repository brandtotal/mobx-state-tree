"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mobx_1 = require("mobx");
var node_1 = require("./core/node");
var utils_1 = require("./utils");
/**
 * Registers middleware on a model instance that is invoked whenever one of it's actions is called, or an action on one of it's children.
 * Will only be invoked on 'root' actions, not on actions called from existing actions.
 *
 * The callback receives two parameter: the `action` parameter describes the action being invoked. The `next()` function can be used
 * to kick off the next middleware in the chain. Not invoking `next()` prevents the action from actually being executed!
 *
 * Action calls have the following signature:
 *
 * ```
 * export type IActionCall = {
 *    name: string;
 *    path?: string;
 *    args?: any[];
 * }
 * ```
 *
 * Example of a logging middleware:
 * ```
 * function logger(action, next) {
 *   console.dir(action)
 *   return next()
 * }
 *
 * onAction(myStore, logger)
 *
 * myStore.user.setAge(17)
 *
 * // emits:
 * {
 *    name: "setAge"
 *    path: "/user",
 *    args: [17]
 * }
 * ```
 *
 * @export
 * @param {Object} target model to intercept actions on
 * @param {(action: IActionCall, next: () => void) => void} callback the middleware that should be invoked whenever an action is triggered.
 * @returns {IDisposer} function to remove the middleware
 */
function onAction(target, callback) {
    return node_1.getNode(target).onAction(callback);
}
exports.onAction = onAction;
/**
 * Registers a function that will be invoked for each that as made to the provided model instance, or any of it's children.
 * See 'patches' for more details. onPatch events are emitted immediately and will not await the end of a transaction.
 * Patches can be used to deep observe a model tree.
 *
 * @export
 * @param {Object} target the model instance from which to receive patches
 * @param {(patch: IJsonPatch) => void} callback the callback that is invoked for each patch
 * @returns {IDisposer} function to remove the listener
 */
function onPatch(target, callback) {
    return node_1.getNode(target).onPatch(callback);
}
exports.onPatch = onPatch;
/**
 * Registeres a function that is invoked whenever a new snapshot for the given model instance is available.
 * The listener will only be fire at the and a MobX (trans)action
 *
 * @export
 * @param {Object} target
 * @param {(snapshot: any) => void} callback
 * @returns {IDisposer}
 */
function onSnapshot(target, callback) {
    return node_1.getNode(target).onSnapshot(callback);
}
exports.onSnapshot = onSnapshot;
/**
 * Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch} patch
 * @returns
 */
function applyPatch(target, patch) {
    return node_1.getNode(target).applyPatch(patch);
}
exports.applyPatch = applyPatch;
/**
 * Applies a number of JSON patches in a single MobX transaction
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch[]} patches
 */
function applyPatches(target, patches) {
    var node = node_1.getNode(target);
    mobx_1.runInAction(function () {
        patches.forEach(function (p) { return node.applyPatch(p); });
    });
}
exports.applyPatches = applyPatches;
function recordPatches(subject) {
    var recorder = {
        patches: [],
        stop: function () { return disposer(); },
        replay: function (target) {
            applyPatches(target, recorder.patches);
        }
    };
    var disposer = onPatch(subject, function (patch) {
        recorder.patches.push(patch);
    });
    return recorder;
}
exports.recordPatches = recordPatches;
/**
 * Dispatches an Action on a model instance. All middlewares will be triggered.
 * Returns the value of the last actoin
 *
 * @export
 * @param {Object} target
 * @param {IActionCall} action
 * @param {IActionCallOptions} [options]
 * @returns
 */
function applyAction(target, action) {
    return node_1.getNode(target).applyAction(action);
}
exports.applyAction = applyAction;
/**
 * Applies a series of actions in a single MobX transaction.
 *
 * Does not return any value
 *
 * @export
 * @param {Object} target
 * @param {IActionCall[]} actions
 * @param {IActionCallOptions} [options]
 */
function applyActions(target, actions) {
    var node = node_1.getNode(target);
    mobx_1.runInAction(function () {
        actions.forEach(function (action) { return node.applyAction(action); });
    });
}
exports.applyActions = applyActions;
function recordActions(subject) {
    var recorder = {
        actions: [],
        stop: function () { return disposer(); },
        replay: function (target) {
            applyActions(target, recorder.actions);
        }
    };
    var disposer = onAction(subject, function (action, next) {
        recorder.actions.push(action);
        return next();
    });
    return recorder;
}
exports.recordActions = recordActions;
/**
 * Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
function applySnapshot(target, snapshot) {
    return node_1.getNode(target).applySnapshot(snapshot);
}
exports.applySnapshot = applySnapshot;
/**
 * Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
 * structural sharing where possible. Doesn't require MobX transactions to be completed.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
function getSnapshot(target) {
    return node_1.getNode(target).snapshot;
}
exports.getSnapshot = getSnapshot;
/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {boolean} [strict=false]
 * @returns {boolean}
 */
function hasParent(target, strict) {
    if (strict === void 0) { strict = false; }
    return getParent(target, strict) !== null;
}
exports.hasParent = hasParent;
/**
 * TODO:
 * Given a model instance, returns `true` if the object has same parent, which is a model object, that is, not an
 * map or array.
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
// export function hasParentObject(target: IModel): boolean {
//     return getParentObject(target) !== null
// }
/**
 * Returns the immediate parent of this object, or null. Parent can be either an object, map or array
 * TODO:? strict mode?
 * @export
 * @param {Object} target
 * @param {boolean} [strict=false]
 * @returns {*}
 */
function getParent(target, strict) {
    if (strict === void 0) { strict = false; }
    // const node = strict
    //     ? getNode(target).parent
    //     : findNode(getNode(target))
    var node = node_1.getNode(target);
    return node.parent ? node.parent.target : null;
}
exports.getParent = getParent;
/**
 * TODO:
 * Returns the closest parent that is a model instance, but which isn't an array or map.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
// export function getParentObject(target: IModel): IModel {
//     // TODO: remove this special notion of closest object node?
//     const node = findEnclosingObjectNode(getNode(target))
//     return node ? node.state : null
// }
/**
 * Given an object in a model tree, returns the root object of that tree
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
function getRoot(target) {
    return node_1.getNode(target).root.target;
}
exports.getRoot = getRoot;
/**
 * Returns the path of the given object in the model tree
 *
 * @export
 * @param {Object} target
 * @returns {string}
 */
function getPath(target) {
    return node_1.getNode(target).path;
}
exports.getPath = getPath;
/**
 * Returns the path of the given object as unescaped string array
 *
 * @export
 * @param {Object} target
 * @returns {string[]}
 */
function getPathParts(target) {
    return node_1.getNode(target).pathParts;
}
exports.getPathParts = getPathParts;
/**
 * Returns true if the given object is the root of a model tree
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
function isRoot(target) {
    return node_1.getNode(target).isRoot;
}
exports.isRoot = isRoot;
/**
 * Resolves a path relatively to a given object.
 *
 * @export
 * @param {Object} target
 * @param {string} path - escaped json path
 * @returns {*}
 */
function resolve(target, path) {
    var node = node_1.getNode(target).resolve(path);
    return node ? node.target : undefined;
}
exports.resolve = resolve;
/**
 *
 *
 * @export
 * @param {Object} target
 * @param {string} path
 * @returns {*}
 */
function tryResolve(target, path) {
    var node = node_1.getNode(target).resolve(path, false);
    if (node === undefined)
        return undefined;
    return node ? node.target : undefined;
}
exports.tryResolve = tryResolve;
/**
 *
 *
 * @export
 * @param {Object} target
 * @returns {Object}
 */
function getFromEnvironment(target, key) {
    return node_1.getNode(target).getFromEnvironment(key);
}
exports.getFromEnvironment = getFromEnvironment;
/**
 *
 *
 * @export
 * @template T
 * @param {T} source
 * @param {*} [customEnvironment]
 * @returns {T}
 */
function clone(source, customEnvironment) {
    var node = node_1.getNode(source);
    return node.factory(node.snapshot, customEnvironment || node.environment);
}
exports.clone = clone;
/**
 * Internal function, use with care!
 */
/**
 *
 *
 * @export
 * @param {any} thing
 * @returns {*}
 */
function _getNode(thing) {
    return node_1.getNode(thing);
}
exports._getNode = _getNode;
function detach(thing) {
    node_1.getNode(thing).detach();
    return thing;
}
exports.detach = detach;
function testActions(factory, initialState) {
    var actions = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        actions[_i - 2] = arguments[_i];
    }
    var testInstance = factory(initialState);
    applyActions(testInstance, actions);
    return getSnapshot(testInstance);
}
exports.testActions = testActions;
var appState = mobx_1.observable.shallowBox(undefined);
function resetAppState() {
    appState.set(undefined);
}
exports.resetAppState = resetAppState;
function initializeAppState(factory, initialSnapshot, environment) {
    utils_1.invariant(!appState, "Global app state was already initialized, use 'resetAppState' to reset it");
    appState.set(factory(initialSnapshot, environment));
}
exports.initializeAppState = initializeAppState;
function getAppState() {
    utils_1.invariant(!!appState, "Global app state has not been initialized, use 'initializeAppState' for globally shared state");
    return appState.get();
}
exports.getAppState = getAppState;
//# sourceMappingURL=top-level-api.js.map