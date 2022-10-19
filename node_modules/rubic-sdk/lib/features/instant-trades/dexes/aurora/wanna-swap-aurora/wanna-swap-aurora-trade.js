"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WannaSwapAuroraTrade = void 0;
var uniswap_v2_abstract_trade_1 = require("../../common/uniswap-v2-abstract/uniswap-v2-abstract-trade");
var features_1 = require("../../../..");
var constants_1 = require("./constants");
var WannaSwapAuroraTrade = /** @class */ (function (_super) {
    __extends(WannaSwapAuroraTrade, _super);
    function WannaSwapAuroraTrade(tradeStruct) {
        var _this = _super.call(this, tradeStruct) || this;
        _this.contractAddress = constants_1.WANNA_SWAP_AURORA_CONTRACT_ADDRESS;
        return _this;
    }
    Object.defineProperty(WannaSwapAuroraTrade, "type", {
        get: function () {
            return features_1.TRADE_TYPE.WANNA_SWAP;
        },
        enumerable: false,
        configurable: true
    });
    return WannaSwapAuroraTrade;
}(uniswap_v2_abstract_trade_1.UniswapV2AbstractTrade));
exports.WannaSwapAuroraTrade = WannaSwapAuroraTrade;
//# sourceMappingURL=wanna-swap-aurora-trade.js.map