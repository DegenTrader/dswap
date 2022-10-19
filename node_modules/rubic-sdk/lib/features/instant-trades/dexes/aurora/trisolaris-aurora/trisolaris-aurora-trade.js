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
exports.TrisolarisAuroraTrade = void 0;
var uniswap_v2_abstract_trade_1 = require("../../common/uniswap-v2-abstract/uniswap-v2-abstract-trade");
var features_1 = require("../../../..");
var constants_1 = require("./constants");
var TrisolarisAuroraTrade = /** @class */ (function (_super) {
    __extends(TrisolarisAuroraTrade, _super);
    function TrisolarisAuroraTrade(tradeStruct) {
        var _this = _super.call(this, tradeStruct) || this;
        _this.contractAddress = constants_1.TRISOLARIS_AURORA_CONTRACT_ADDRESS;
        return _this;
    }
    Object.defineProperty(TrisolarisAuroraTrade, "type", {
        get: function () {
            return features_1.TRADE_TYPE.TRISOLARIS;
        },
        enumerable: false,
        configurable: true
    });
    return TrisolarisAuroraTrade;
}(uniswap_v2_abstract_trade_1.UniswapV2AbstractTrade));
exports.TrisolarisAuroraTrade = TrisolarisAuroraTrade;
//# sourceMappingURL=trisolaris-aurora-trade.js.map