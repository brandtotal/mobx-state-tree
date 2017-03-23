import { IActionCall } from "../core/action";
export interface IMiddleWareApi {
    getState: () => any;
    dispatch: (action: any) => void;
}
export interface IReduxStore extends IMiddleWareApi {
    subscribe(listener: (snapshot: any) => void): any;
}
export declare type MiddleWare = (middlewareApi: IMiddleWareApi) => ((next: (action: IActionCall) => void) => void);
export declare function asReduxStore(model: any, ...middlewares: MiddleWare[]): IReduxStore;
