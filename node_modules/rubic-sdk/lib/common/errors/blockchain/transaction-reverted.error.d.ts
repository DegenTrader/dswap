import { RubicSdkError } from "../rubic-sdk.error";
/**
 * Thrown, if transaction was reverted without specified error.
 */
export declare class TransactionRevertedError extends RubicSdkError {
    constructor();
}
