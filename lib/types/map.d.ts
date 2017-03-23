import { ObservableMap, IMapChange, IMapWillChange } from "mobx";
import { Node } from "../core/node";
import { IFactory } from "../core/factories";
import { IJsonPatch } from "../core/json-patch";
import { ComplexType } from "../core/types";
export declare class MapType extends ComplexType {
    isMapFactory: boolean;
    subType: IFactory<any, any>;
    constructor(name: string, subType: IFactory<any, any>);
    describe(): string;
    createNewInstance(): ObservableMap<{}>;
    finalizeNewInstance(instance: any): void;
    getChildNodes(_node: Node, target: any): [string, Node][];
    getChildNode(node: Node, target: any, key: any): Node | null;
    willChange(node: Node, change: IMapWillChange<any>): Object | null;
    serialize(node: Node, target: any): Object;
    didChange(node: Node, change: IMapChange<any>): void;
    applyPatchLocally(node: Node, target: any, subpath: string, patch: IJsonPatch): void;
    applySnapshot(node: Node, target: any, snapshot: any): void;
    getChildFactory(key: string): IFactory<any, any>;
    isValidSnapshot(snapshot: any): boolean;
}
export declare function createMapFactory<S, T>(subtype: IFactory<S, T>): IFactory<{
    [key: string]: S;
}, ObservableMap<T>>;
export declare function isMapFactory(factory: any): boolean;
