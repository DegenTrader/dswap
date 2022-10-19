import { RubicSdkError } from "../rubic-sdk.error";
/**
 * Thrown, when user doesn't have enough native token balance for gas fee plus `value`.
 */
export declare class InsufficientFundsGasPriceValueError extends RubicSdkError {
    constructor();
}
