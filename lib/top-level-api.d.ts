import { IJsonPatch } from "./core/json-patch";
import { IDisposer } from "./utils";
import { IActionCall } from "./core/action";
import { IFactory, IModel } from "./core/factories";
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
export declare function onAction(target: IModel, callback: (action: IActionCall, next: () => void) => void): IDisposer;
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
export declare function onPatch(target: IModel, callback: (patch: IJsonPatch) => void): IDisposer;
/**
 * Registeres a function that is invoked whenever a new snapshot for the given model instance is available.
 * The listener will only be fire at the and a MobX (trans)action
 *
 * @export
 * @param {Object} target
 * @param {(snapshot: any) => void} callback
 * @returns {IDisposer}
 */
export declare function onSnapshot(target: IModel, callback: (snapshot: any) => void): IDisposer;
/**
 * Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch} patch
 * @returns
 */
export declare function applyPatch(target: IModel, patch: IJsonPatch): void;
/**
 * Applies a number of JSON patches in a single MobX transaction
 *
 * @export
 * @param {Object} target
 * @param {IJsonPatch[]} patches
 */
export declare function applyPatches(target: IModel, patches: IJsonPatch[]): void;
export interface IPatchRecorder {
    patches: IJsonPatch[];
    stop(): any;
    replay(target: IModel): any;
}
export declare function recordPatches(subject: IModel): IPatchRecorder;
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
export declare function applyAction(target: IModel, action: IActionCall): any;
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
export declare function applyActions(target: IModel, actions: IActionCall[]): void;
export interface IActionRecorder {
    actions: IActionCall[];
    stop(): any;
    replay(target: IModel): any;
}
export declare function recordActions(subject: IModel): IActionRecorder;
/**
 * Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.
 *
 * @export
 * @param {Object} target
 * @param {Object} snapshot
 * @returns
 */
export declare function applySnapshot<S, T>(target: T & IModel, snapshot: S): any;
/**
 * Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
 * structural sharing where possible. Doesn't require MobX transactions to be completed.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export declare function getSnapshot<S, T>(target: T & IModel): S;
/**
 * Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array
 *
 * @export
 * @param {Object} target
 * @param {boolean} [strict=false]
 * @returns {boolean}
 */
export declare function hasParent(target: IModel, strict?: boolean): boolean;
/**
 * TODO:
 * Given a model instance, returns `true` if the object has same parent, which is a model object, that is, not an
 * map or array.
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
/**
 * Returns the immediate parent of this object, or null. Parent can be either an object, map or array
 * TODO:? strict mode?
 * @export
 * @param {Object} target
 * @param {boolean} [strict=false]
 * @returns {*}
 */
export declare function getParent(target: IModel, strict?: boolean): IModel;
/**
 * TODO:
 * Returns the closest parent that is a model instance, but which isn't an array or map.
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
/**
 * Given an object in a model tree, returns the root object of that tree
 *
 * @export
 * @param {Object} target
 * @returns {*}
 */
export declare function getRoot(target: IModel): IModel;
/**
 * Returns the path of the given object in the model tree
 *
 * @export
 * @param {Object} target
 * @returns {string}
 */
export declare function getPath(target: IModel): string;
/**
 * Returns the path of the given object as unescaped string array
 *
 * @export
 * @param {Object} target
 * @returns {string[]}
 */
export declare function getPathParts(target: IModel): string[];
/**
 * Returns true if the given object is the root of a model tree
 *
 * @export
 * @param {Object} target
 * @returns {boolean}
 */
export declare function isRoot(target: IModel): boolean;
/**
 * Resolves a path relatively to a given object.
 *
 * @export
 * @param {Object} target
 * @param {string} path - escaped json path
 * @returns {*}
 */
export declare function resolve(target: IModel, path: string): IModel | any;
/**
 *
 *
 * @export
 * @param {Object} target
 * @param {string} path
 * @returns {*}
 */
export declare function tryResolve(target: IModel, path: string): IModel | any;
/**
 *
 *
 * @export
 * @param {Object} target
 * @returns {Object}
 */
export declare function getFromEnvironment(target: IModel, key: string): any;
/**
 *
 *
 * @export
 * @template T
 * @param {T} source
 * @param {*} [customEnvironment]
 * @returns {T}
 */
export declare function clone<T extends IModel>(source: T, customEnvironment?: any): T;
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
export declare function _getNode(thing: IModel): any;
export declare function detach<T extends IModel>(thing: T): T;
export declare function testActions<S, T extends IModel>(factory: IFactory<S, T>, initialState: S, ...actions: IActionCall[]): S;
export declare function resetAppState(): void;
export declare function initializeAppState<S, T>(factory: IFactory<S, T>, initialSnapshot?: S, environment?: Object): void;
export declare function getAppState<T>(): T;
