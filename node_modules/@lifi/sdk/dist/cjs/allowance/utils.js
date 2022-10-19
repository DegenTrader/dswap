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
exports.groupByChain = exports.getAllowanceViaMulticall = exports.setApproval = exports.getApproved = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const ChainsService_1 = __importDefault(require("../services/ChainsService"));
const types_1 = require("../types");
const errors_1 = require("../utils/errors");
const multicall_1 = require("../utils/multicall");
const getApproved = (signer, tokenAddress, contractAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const signerAddress = yield signer.getAddress();
    const erc20 = new ethers_1.Contract(tokenAddress, types_1.ERC20_ABI, signer);
    try {
        const approved = yield erc20.allowance(signerAddress, contractAddress);
        return new bignumber_js_1.default(approved.toString());
    }
    catch (e) {
        return new bignumber_js_1.default(0);
    }
});
exports.getApproved = getApproved;
const setApproval = (signer, tokenAddress, contractAddress, amount) => {
    const erc20 = new ethers_1.Contract(tokenAddress, types_1.ERC20_ABI, signer);
    return erc20.approve(contractAddress, amount);
};
exports.setApproval = setApproval;
const getAllowanceViaMulticall = (signer, chainId, tokenData) => __awaiter(void 0, void 0, void 0, function* () {
    const chainsService = ChainsService_1.default.getInstance();
    const chain = yield chainsService.getChainById(chainId);
    if (!chain.multicallAddress) {
        throw new errors_1.ServerError(`No multicall address configured for chainId ${chainId}.`);
    }
    const ownerAddress = yield signer.getAddress();
    const calls = [];
    tokenData.map(({ token, approvalAddress }) => {
        calls.push({
            address: token.address,
            name: 'allowance',
            params: [ownerAddress, approvalAddress],
        });
    });
    const result = yield (0, multicall_1.fetchDataUsingMulticall)(calls, types_1.ERC20_ABI, chainId, chain.multicallAddress);
    if (!result.length) {
        throw new errors_1.ServerError(`Couldn't load allowance from chainId ${chainId} using multicall.`);
    }
    const parsedResult = result.map(({ data }) => {
        var _a;
        return ({
            approvalAmount: (_a = data) !== null && _a !== void 0 ? _a : new bignumber_js_1.default(0),
        });
    });
    return tokenData.map(({ token, approvalAddress }, i) => ({
        token,
        approvalAddress,
        approvedAmount: parsedResult[i].approvalAmount,
    }));
});
exports.getAllowanceViaMulticall = getAllowanceViaMulticall;
const groupByChain = (tokenDataList) => {
    // group by chain
    const tokenDataByChain = {};
    tokenDataList.forEach((tokenData) => {
        if (!tokenDataByChain[tokenData.token.chainId]) {
            tokenDataByChain[tokenData.token.chainId] = [];
        }
        tokenDataByChain[tokenData.token.chainId].push(tokenData);
    });
    return tokenDataByChain;
};
exports.groupByChain = groupByChain;
