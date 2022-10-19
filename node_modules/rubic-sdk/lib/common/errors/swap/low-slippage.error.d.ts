import { RubicSdkError } from "../rubic-sdk.error";
/**
 * Thrown, when slippage tolerance is too low for selected token.
 */
export declare class LowSlippageError extends RubicSdkError {
    constructor();
}
