import { IFactory } from "../core/factories";
export declare function createMaybeFactory<S, T>(type: IFactory<S, T>): IFactory<S | null | undefined, T | null | undefined>;
