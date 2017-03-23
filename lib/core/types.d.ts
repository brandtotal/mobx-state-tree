import { Node } from "./node";
import { IJsonPatch } from "../core/json-patch";
import { IFactory, IModel } from "./factories";
export interface IType {
    name: string;
    is(thing: IModel | any): boolean;
    create(snapshot: any, environment?: any): any;
    factory: IFactory<any, any>;
    describe(): string;
}
export declare type ITypeChecker = (value: IModel | any) => boolean;
export declare abstract class Type implements IType {
    name: string;
    factory: IFactory<any, any>;
    constructor(name: string);
    abstract create(snapshot: any, environment?: any): any;
    abstract is(thing: any): boolean;
    abstract describe(): string;
    protected initializeFactory(): IFactory<any, any>;
}
export declare abstract class ComplexType extends Type {
    create(snapshot: any, environment?: any): any;
    abstract createNewInstance(): any;
    abstract finalizeNewInstance(target: any): any;
    abstract applySnapshot(node: Node, target: any, snapshot: any): any;
    abstract getChildNodes(node: Node, target: any): [string, Node][];
    abstract getChildNode(node: Node, target: any, key: any): Node | null;
    abstract willChange(node: Node, change: any): Object | null;
    abstract didChange(node: Node, change: any): void;
    abstract serialize(node: Node, target: any): any;
    abstract applyPatchLocally(node: Node, target: any, subpath: string, patch: IJsonPatch): void;
    abstract getChildFactory(key: string): IFactory<any, any>;
    abstract isValidSnapshot(snapshot: any): boolean;
    is(value: IModel | any): boolean;
}
