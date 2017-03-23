import { IFactory } from "../core/factories";
import { Type } from "../core/types";
export declare class Literal extends Type {
    readonly value: any;
    constructor(value: any);
    create(value: any): any;
    describe(): string;
    is(value: any): boolean;
}
export declare function createLiteralFactory<S>(value: S): IFactory<S, S>;
