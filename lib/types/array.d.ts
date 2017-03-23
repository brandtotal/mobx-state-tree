import { IObservableArray, IArrayWillChange, IArrayWillSplice, IArrayChange, IArraySplice } from "mobx";
import { Node } from "../core/node";
import { IJsonPatch } from "../core/json-patch";
import { IFactory } from "../core/factories";
import { ComplexType } from "../core/types";
export declare class ArrayType extends ComplexType {
    isArrayFactory: boolean;
    subType: IFactory<any, any>;
    constructor(name: any, subType: IFactory<any, any>);
    describe(): string;
    createNewInstance(): IObservableArray<{}>;
    finalizeNewInstance(instance: any): void;
    getChildNodes(_: Node, target: any): [string, Node][];
    getChildNode(node: Node, target: any, key: any): Node | null;
    willChange(node: Node, change: IArrayWillChange<any> | IArrayWillSplice<any>): Object | null;
    serialize(node: Node, target: any): any;
    didChange(node: Node, change: IArrayChange<any> | IArraySplice<any>): void;
    applyPatchLocally(node: Node, target: any, subpath: string, patch: IJsonPatch): void;
    applySnapshot(node: Node, target: any, snapshot: any): void;
    getChildFactory(key: string): IFactory<any, any>;
    isValidSnapshot(snapshot: any): boolean;
}
export declare function createArrayFactory<S, T extends S>(subtype: IFactory<S, T>): IFactory<S[], IObservableArray<T>>;
export declare function isArrayFactory(factory: any): boolean;
