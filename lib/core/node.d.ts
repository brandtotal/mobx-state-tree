import { ComplexType } from "./types";
import { IModel, IFactory } from "./factories";
import { IActionHandler } from "./action";
import { IDisposer } from "../utils";
import { IJsonPatch } from "./json-patch";
import { IActionCall } from "./action";
export declare class Node {
    readonly target: any;
    readonly environment: any;
    _parent: Node | null;
    readonly factory: IFactory<any, any>;
    private interceptDisposer;
    readonly snapshotSubscribers: ((snapshot: any) => void)[];
    readonly patchSubscribers: ((patches: IJsonPatch) => void)[];
    readonly actionSubscribers: IActionHandler[];
    _isRunningAction: boolean;
    constructor(initialState: any, environment: any, factory: IFactory<any, any>);
    readonly type: ComplexType;
    readonly pathParts: string[];
    /**
     * Returnes (escaped) path representation as string
     */
    readonly path: string;
    readonly subpath: string;
    readonly isRoot: boolean;
    readonly parent: Node | null;
    readonly root: any;
    readonly snapshot: any;
    onSnapshot(onChange: (snapshot: any) => void): IDisposer;
    applySnapshot(snapshot: any): any;
    applyPatch(patch: IJsonPatch): void;
    applyPatchLocally(subpath: any, patch: IJsonPatch): void;
    onPatch(onPatch: (patches: IJsonPatch) => void): IDisposer;
    emitPatch(patch: IJsonPatch, source: Node, distance?: number): void;
    setParent(newParent: Node | null, subpath?: string | null): void;
    prepareChild(subpath: string, child: any): any;
    detach(): void;
    resolve(pathParts: string): Node;
    resolve(pathParts: string, failIfResolveFails: boolean): Node | undefined;
    resolvePath(pathParts: string[]): Node;
    resolvePath(pathParts: string[], failIfResolveFails: boolean): Node | undefined;
    isRunningAction(): boolean;
    applyAction(action: IActionCall): void;
    emitAction(instance: Node, action: IActionCall, next: any): any;
    onAction(listener: (action: IActionCall, next: () => void) => void): IDisposer;
    getFromEnvironment(key: string): any;
    getChildNode(subpath: string): Node | null;
    getChildNodes(): [string, Node][];
    getChildFactory(key: string): IFactory<any, any>;
}
export declare function hasNode(value: any): value is IModel;
/**
 * Tries to convert a value to a TreeNode. If possible or already done,
 * the first callback is invoked, otherwise the second.
 * The result of this function is the return value of the callbacks
 */
export declare function maybeNode<T, R>(value: T & IModel, asNodeCb: (node: Node, value: T) => R, asPrimitiveCb?: (value: T) => R): R;
export declare function getNode(value: IModel): Node;
export declare function getPath(thing: IModel): string;
export declare function getRelativePath(base: Node, target: Node): string;
export declare function getParent(thing: IModel): IModel;
export declare function valueToSnapshot(thing: any): any;
