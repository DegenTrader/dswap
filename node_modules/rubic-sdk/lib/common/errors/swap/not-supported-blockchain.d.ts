import { RubicSdkError } from "../rubic-sdk.error";
/**
 * @internal
 * Thrown, when provider does not support provided blockchain.
 */
export declare class NotSupportedBlockchain extends RubicSdkError {
    constructor();
}
