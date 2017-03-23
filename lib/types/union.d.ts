import { IFactory } from "../core/factories";
import { Type } from "../core/types";
export declare type IFactoryDispatcher = (snapshot: any) => IFactory<any, any>;
export declare class Union extends Type {
    readonly dispatcher: IFactoryDispatcher | null;
    readonly types: IFactory<any, any>[];
    constructor(name: any, types: IFactory<any, any>[], dispatcher: IFactoryDispatcher | null);
    describe(): string;
    create(value: any, environment?: any): any;
    is(value: any): boolean;
}
export declare function createUnionFactory<SA, SB, TA, TB>(dispatch: IFactoryDispatcher, A: IFactory<SA, TA>, B: IFactory<SB, TB>): IFactory<SA | SB, TA | TB>;
export declare function createUnionFactory<SA, SB, TA, TB>(A: IFactory<SA, TA>, B: IFactory<SB, TB>): IFactory<SA | SB, TA | TB>;
