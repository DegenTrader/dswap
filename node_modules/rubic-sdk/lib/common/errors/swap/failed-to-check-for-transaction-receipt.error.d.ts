import { RubicSdkError } from "../rubic-sdk.error";
/**
 * @internal
 * Thrown, when transaction is passed, but web3 cannot retrieve transaction receipt.
 */
export declare class FailedToCheckForTransactionReceiptError extends RubicSdkError {
    constructor();
}
