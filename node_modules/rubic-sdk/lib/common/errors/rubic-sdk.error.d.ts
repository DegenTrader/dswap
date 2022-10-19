/**
 * Base class for all errors that can be thrown in sdk.
 */
export declare class RubicSdkError extends Error {
    constructor(message?: string, errorPotions?: ErrorOptions);
}
