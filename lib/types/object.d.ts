import { IObjectChange, IObjectWillChange, IAction } from "mobx";
import { Node } from "../core/node";
import { IFactory } from "../core/factories";
import { ComplexType } from "../core/types";
export declare class ObjectType extends ComplexType {
    props: {
        [key: string]: IFactory<any, any>;
    };
    baseModel: any;
    initializers: ((target: any) => void)[];
    finalizers: ((target: any) => void)[];
    isObjectFactory: boolean;
    constructor(name: string, baseModel: any);
    describe(): string;
    createNewInstance(): Object;
    finalizeNewInstance(instance: any): void;
    extractPropsFromBaseModel(): void;
    getChildNodes(node: any, instance: any): [string, Node][];
    getChildNode(node: any, instance: any, key: any): Node | null;
    willChange(node: any, change: IObjectWillChange): Object | null;
    didChange(node: Node, change: IObjectChange): void;
    serialize(node: Node, instance: any): any;
    applyPatchLocally(node: Node, target: any, subpath: any, patch: any): void;
    applySnapshot(node: Node, target: any, snapshot: any): void;
    getChildFactory(key: string): IFactory<any, any>;
    isValidSnapshot(snapshot: any): boolean;
}
export declare type IBaseModelDefinition<S extends Object, T> = {
    [K in keyof T]: IFactory<any, T[K]> | T[K] & IAction | T[K];
};
export declare function createModelFactory<S extends Object, T extends S>(baseModel: IBaseModelDefinition<S, T>): IFactory<S, T>;
export declare function createModelFactory<S extends Object, T extends S>(name: string, baseModel: IBaseModelDefinition<S, T>): IFactory<S, T>;
export declare function composeFactory<AS, AT, BS, BT>(name: string, a: IFactory<AS, AT>, b: IFactory<BS, BT>): IFactory<AS & BS, AT & BT>;
export declare function composeFactory<AS, AT, BS, BT, CS, CT>(name: string, a: IFactory<AS, AT>, b: IFactory<BS, BT>, c: IFactory<CS, CT>): IFactory<AS & BS & CS, AT & BT & CT>;
export declare function composeFactory<S, T>(name: string, ...models: IFactory<any, any>[]): IFactory<S, T>;
export declare function composeFactory<AS, AT, BS, BT>(a: IFactory<AS, AT>, b: IFactory<BS, BT>): IFactory<AS & BS, AT & BT>;
export declare function composeFactory<AS, AT, BS, BT, CS, CT>(a: IFactory<AS, AT>, b: IFactory<BS, BT>, c: IFactory<CS, CT>): IFactory<AS & BS & CS, AT & BT & CT>;
export declare function composeFactory<S, T>(...models: IFactory<any, any>[]): IFactory<S, T>;
export declare function isObjectFactory(factory: any): boolean;
