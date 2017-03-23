import { IType, ITypeChecker } from "./types";
export declare type IModel = {
    $treenode: any;
} & Object;
export interface IFactory<S, T> {
    (snapshot?: S, env?: Object): T & IModel;
    factoryName: string;
    is: ITypeChecker;
    isFactory: boolean;
    type: IType;
}
export declare function isFactory(value: any): value is IFactory<any, any>;
export declare function getFactory(object: IModel): IFactory<any, any>;
export declare function getChildFactory(object: IModel, child: string): IFactory<any, any>;
export declare function isModel(model: any): model is IModel;
