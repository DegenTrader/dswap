/// <reference types="node" />
export interface ClearablePromise<T> extends Promise<T> {
    clear: () => void;
}
export declare type PTimeoutOptions = {
    readonly customTimers?: {
        setTimeout: typeof setTimeout;
        clearTimeout: typeof clearTimeout;
    };
};
export default function pTimeout<ValueType>(promise: PromiseLike<ValueType>, milliseconds: number, message?: string | Error, options?: PTimeoutOptions): ClearablePromise<ValueType>;
export default function pTimeout<ValueType, FallbackReturnType>(promise: PromiseLike<ValueType>, milliseconds: number, fallback?: () => FallbackReturnType | Promise<FallbackReturnType>, options?: PTimeoutOptions): ClearablePromise<ValueType | FallbackReturnType>;
