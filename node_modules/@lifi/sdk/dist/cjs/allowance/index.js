"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeTokenApproval = exports.approveToken = exports.bulkGetTokenApproval = exports.getTokenApproval = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const helpers_1 = require("../helpers");
const utils_1 = require("../utils/utils");
const utils_2 = require("./utils");
const getTokenApproval = (signer, token, approvalAddress) => __awaiter(void 0, void 0, void 0, function* () {
    // native token don't need approval
    if ((0, utils_1.isNativeTokenAddress)(token.address)) {
        return;
    }
    const approved = yield (0, utils_2.getApproved)(signer, token.address, approvalAddress);
    return approved.toString();
});
exports.getTokenApproval = getTokenApproval;
const bulkGetTokenApproval = (signer, tokenData) => __awaiter(void 0, void 0, void 0, function* () {
    // filter out native tokens
    const filteredTokenData = tokenData.filter(({ token }) => !(0, utils_1.isNativeTokenAddress)(token.address));
    // group by chain
    const tokenDataByChain = (0, utils_2.groupByChain)(filteredTokenData);
    const approvalPromises = Object.keys(tokenDataByChain).map((chainId) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedChainId = Number.parseInt(chainId);
        // get allowances for current chain and token list
        return (0, utils_2.getAllowanceViaMulticall)(signer, parsedChainId, tokenDataByChain[parsedChainId]);
    }));
    const approvalsByChain = yield Promise.all(approvalPromises);
    const approvals = approvalsByChain.flat();
    return tokenData.map(({ token }) => {
        // native token don't need approval
        if ((0, utils_1.isNativeTokenAddress)(token.address)) {
            return { token, approval: undefined };
        }
        const approved = approvals.find((approval) => (0, helpers_1.isSameToken)(approval.token, token));
        return { token, approval: approved === null || approved === void 0 ? void 0 : approved.approvedAmount.toString() };
    });
});
exports.bulkGetTokenApproval = bulkGetTokenApproval;
const approveToken = ({ signer, token, approvalAddress, amount, infiniteApproval = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    // native token don't need approval
    if ((0, utils_1.isNativeTokenAddress)(token.address)) {
        return;
    }
    const approvedAmount = yield (0, utils_2.getApproved)(signer, token.address, approvalAddress);
    if (new bignumber_js_1.default(amount).gt(approvedAmount)) {
        const approvalAmount = infiniteApproval
            ? ethers_1.constants.MaxUint256.toString()
            : amount;
        const approveTx = yield (0, utils_2.setApproval)(signer, token.address, approvalAddress, approvalAmount);
        yield approveTx.wait();
    }
});
exports.approveToken = approveToken;
const revokeTokenApproval = ({ signer, token, approvalAddress, }) => __awaiter(void 0, void 0, void 0, function* () {
    // native token don't need approval
    if ((0, utils_1.isNativeTokenAddress)(token.address)) {
        return;
    }
    const approvedAmount = yield (0, utils_2.getApproved)(signer, token.address, approvalAddress);
    if (!approvedAmount.isZero()) {
        const approveTx = yield (0, utils_2.setApproval)(signer, token.address, approvalAddress, '0');
        yield approveTx.wait();
    }
});
exports.revokeTokenApproval = revokeTokenApproval;
