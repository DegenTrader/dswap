import { RubicSdkError } from "../rubic-sdk.error";
/**
 * @internal
 * Thrown, if rpc provider has not passed healthcheck.
 */
export declare class HealthcheckError extends RubicSdkError {
    constructor();
}
