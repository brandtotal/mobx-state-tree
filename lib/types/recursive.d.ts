import { IFactory } from "../core/factories";
export declare type IRecursiveDef<S, T> = (type: IFactory<S, T>) => IFactory<any, any>;
export declare function recursive<S, T>(name: string, def: IRecursiveDef<S, T>): IFactory<any, any>;
