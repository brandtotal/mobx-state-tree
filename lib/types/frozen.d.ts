import { IFactory } from "../core/factories";
import { Type } from "../core/types";
export declare class Frozen extends Type {
    constructor();
    describe(): string;
    create(value: any, environment?: any): any;
    is(value: any): boolean;
}
export declare const frozen: IFactory<any, any>;
