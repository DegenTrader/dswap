"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notNull = exports.cloneObject = void 0;
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
exports.cloneObject = cloneObject;
/**
 * Filters object, that can possible be `null`.
 */
function notNull(obj) {
    return obj !== null;
}
exports.notNull = notNull;
//# sourceMappingURL=object.js.map