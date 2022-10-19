"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ESTIMATED_GAS = exports.WETH_TO_ETH_ESTIMATED_GAS = void 0;
var bignumber_js_1 = __importDefault(require("bignumber.js"));
exports.WETH_TO_ETH_ESTIMATED_GAS = new bignumber_js_1.default(50000);
exports.DEFAULT_ESTIMATED_GAS = [
    new bignumber_js_1.default(320000),
    new bignumber_js_1.default(420000),
    new bignumber_js_1.default(520000)
];
//# sourceMappingURL=estimated-gas.js.map