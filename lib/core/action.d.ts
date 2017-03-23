import { Node } from "./node";
export declare type IActionCall = {
    name: string;
    path?: string;
    args?: any[];
};
export declare type IActionHandler = (actionCall: IActionCall, next: () => void) => void;
export declare function createNonActionWrapper(instance: any, key: any, func: any): void;
export declare function createActionWrapper(instance: any, key: any, action: Function): void;
export declare function applyActionLocally(node: Node, instance: any, action: IActionCall): void;
