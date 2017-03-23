import { IFactory } from "../core/factories";
import { Type } from "../core/types";
export declare class PrimitiveType extends Type {
    name: string;
    describe(): string;
    create(value: any): any;
    is(thing: any): boolean;
}
export declare type IPrimitive = string | boolean | number | Date;
export declare const primitiveFactory: IFactory<IPrimitive, IPrimitive>;
