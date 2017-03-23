import { IFactory } from "../core/factories";
import { Type } from "../core/types";
export declare class CoreType extends Type {
    readonly checker: (value: any) => boolean;
    constructor(name: any, checker: any);
    describe(): string;
    create(value: any): any;
    is(thing: any): boolean;
}
export declare const string: IFactory<string, string>;
export declare const number: IFactory<number, number>;
export declare const boolean: IFactory<boolean, boolean>;
