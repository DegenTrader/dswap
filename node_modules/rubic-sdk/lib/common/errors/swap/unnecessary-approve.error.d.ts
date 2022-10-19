import { RubicSdkError } from "../rubic-sdk.error";
/**
 * Thrown, when approve method is called, but there is enough allowance.
 */
export declare class UnnecessaryApproveError extends RubicSdkError {
    constructor();
}
