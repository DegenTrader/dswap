"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFromToTokensAmountsByExact = void 0;
var price_token_amount_1 = require("../../../../../core/blockchain/tokens/price-token-amount");
function getFromToTokensAmountsByExact(fromToken, toToken, exact, initialWeiAmount, routeWeiAmount) {
    var fromAmount = exact === 'input' ? initialWeiAmount : routeWeiAmount;
    var toAmount = exact === 'output' ? initialWeiAmount : routeWeiAmount;
    var from = new price_token_amount_1.PriceTokenAmount(__assign(__assign({}, fromToken.asStruct), { weiAmount: fromAmount }));
    var to = new price_token_amount_1.PriceTokenAmount(__assign(__assign({}, toToken.asStruct), { weiAmount: toAmount }));
    return { from: from, to: to };
}
exports.getFromToTokensAmountsByExact = getFromToTokensAmountsByExact;
//# sourceMappingURL=get-from-to-tokens-amounts-by-exact.js.map