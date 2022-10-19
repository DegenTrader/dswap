import { RubicSdkError } from "../rubic-sdk.error";
/**
 * Thrown, when method, which requires connected wallet, is called without
 * wallet being connected.
 */
export declare class WalletNotConnectedError extends RubicSdkError {
    constructor();
}
