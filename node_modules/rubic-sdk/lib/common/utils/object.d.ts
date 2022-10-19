export declare function cloneObject<T extends object>(obj: T): T;
/**
 * Filters object, that can possible be `null`.
 */
export declare function notNull<T>(obj: T | null): obj is T;
