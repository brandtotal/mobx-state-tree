import { IFactory } from "../core/factories";
import { Type } from "../core/types";
export declare type IPredicate = (snapshot: any) => boolean;
export declare class Refinement extends Type {
    readonly type: IFactory<any, any>;
    readonly predicate: IPredicate;
    constructor(name: any, type: IFactory<any, any>, predicate: IPredicate);
    describe(): string;
    create(value: any, environment?: any): any;
    is(value: any): boolean;
}
export declare function createRefinementFactory<S, T>(name: string, type: IFactory<S, T>, predicate: IPredicate): IFactory<S, T>;
