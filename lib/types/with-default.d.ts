import { IFactory } from "../core/factories";
import { Type } from "../core/types";
export declare class DefaultValue extends Type {
    readonly type: IFactory<any, any>;
    readonly defaultValue: any;
    constructor(type: IFactory<any, any>, defaultValue: any);
    describe(): string;
    create(value: any, environment?: any): any;
    is(value: any): boolean;
}
export declare function createDefaultValueFactory<S, T>(type: IFactory<S, T>, defaultValueOrNode: S | T): IFactory<S, T>;
