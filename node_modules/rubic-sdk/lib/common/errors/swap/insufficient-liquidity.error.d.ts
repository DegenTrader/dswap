import { RubicSdkError } from "../rubic-sdk.error";
/**
 * Thrown, when tokens' pair doesn't have enough liquidity.
 */
export declare class InsufficientLiquidityError extends RubicSdkError {
    constructor();
}
