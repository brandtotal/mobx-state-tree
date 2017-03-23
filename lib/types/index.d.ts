import { IObservableArray, ObservableMap, IAction } from "mobx";
import { IFactory } from "../core/factories";
/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
export declare function map<S, T>(subFactory?: IFactory<S, T>): IFactory<{
    [key: string]: S;
}, ObservableMap<T>>;
/**
 *
 *
 * @export
 * @param {ModelFactory} [subFactory=primitiveFactory]
 * @returns
 */
export declare function array<S, T>(subFactory?: IFactory<S, T>): IFactory<T[], IObservableArray<T>>;
export declare const types: {
    primitive: IFactory<string | number | boolean | Date, string | number | boolean | Date>;
    struct: {
        <S extends Object, T extends S>(baseModel: {
            [K in keyof T]: T[K] | IFactory<any, T[K]> | (T[K] & IAction);
        }): IFactory<S, T>;
        <S extends Object, T extends S>(name: string, baseModel: {
            [K in keyof T]: T[K] | IFactory<any, T[K]> | (T[K] & IAction);
        }): IFactory<S, T>;
    };
    extend: {
        <AS, AT, BS, BT>(name: string, a: IFactory<AS, AT>, b: IFactory<BS, BT>): IFactory<AS & BS, AT & BT>;
        <AS, AT, BS, BT, CS, CT>(name: string, a: IFactory<AS, AT>, b: IFactory<BS, BT>, c: IFactory<CS, CT>): IFactory<AS & BS & CS, AT & BT & CT>;
        <S, T>(name: string, ...models: IFactory<any, any>[]): IFactory<S, T>;
        <AS, AT, BS, BT>(a: IFactory<AS, AT>, b: IFactory<BS, BT>): IFactory<AS & BS, AT & BT>;
        <AS, AT, BS, BT, CS, CT>(a: IFactory<AS, AT>, b: IFactory<BS, BT>, c: IFactory<CS, CT>): IFactory<AS & BS & CS, AT & BT & CT>;
        <S, T>(...models: IFactory<any, any>[]): IFactory<S, T>;
    };
    reference: {
        <T>(path: string): T;
        <T>(getter: (identifier: string, owner: {
            $treenode: any;
        } & Object, propertyName: string) => T, setter?: ((value: T, owner: {
            $treenode: any;
        } & Object, propertyName: string) => string) | undefined): T;
        <T>(factory: IFactory<any, T>): T;
    };
    union: {
        <SA, SB, TA, TB>(dispatch: (snapshot: any) => IFactory<any, any>, A: IFactory<SA, TA>, B: IFactory<SB, TB>): IFactory<SA | SB, TA | TB>;
        <SA, SB, TA, TB>(A: IFactory<SA, TA>, B: IFactory<SB, TB>): IFactory<SA | SB, TA | TB>;
    };
    withDefault: <S, T>(type: IFactory<S, T>, defaultValueOrNode: S | T) => IFactory<S, T>;
    literal: <S>(value: S) => IFactory<S, S>;
    maybe: <S, T>(type: IFactory<S, T>) => IFactory<S | null | undefined, T | null | undefined>;
    refinement: <S, T>(name: string, type: IFactory<S, T>, predicate: (snapshot: any) => boolean) => IFactory<S, T>;
    string: IFactory<string, string>;
    boolean: IFactory<boolean, boolean>;
    number: IFactory<number, number>;
    map: <S, T>(subFactory?: IFactory<S, T>) => IFactory<{
        [key: string]: S;
    }, ObservableMap<T>>;
    array: <S, T>(subFactory?: IFactory<S, T>) => IFactory<T[], IObservableArray<T>>;
    frozen: IFactory<any, any>;
    recursive: <S, T>(name: string, def: (type: IFactory<S, T>) => IFactory<any, any>) => IFactory<any, any>;
};
