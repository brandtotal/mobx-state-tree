import { IModel, IFactory } from "../core/factories";
export declare type IReferenceGetter<T> = (identifier: string, owner: IModel, propertyName: string) => T;
export declare type IReferenceSetter<T> = (value: T, owner: IModel, propertyName: string) => string;
export interface IReferenceDescription {
    getter: IReferenceGetter<any>;
    setter: IReferenceSetter<any>;
    isReference: true;
}
export declare function reference<T>(path: string): T;
export declare function reference<T>(getter: IReferenceGetter<T>, setter?: IReferenceSetter<T>): T;
export declare function reference<T>(factory: IFactory<any, T>): T;
export declare function createReferenceProps(name: string, ref: IReferenceDescription): {
    [x: string]: string;
};
export declare function isReferenceFactory(thing: any): boolean;
