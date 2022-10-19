import { RubicSdkError } from "../rubic-sdk.error";
/**
 * Thrown, when user is selling deflationary token with too low slippage.
 */
export declare class LowSlippageDeflationaryTokenError extends RubicSdkError {
    constructor();
}
