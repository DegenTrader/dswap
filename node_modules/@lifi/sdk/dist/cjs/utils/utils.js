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
exports.isNativeTokenAddress = exports.isZeroAddress = exports.loadTransactionReceipt = exports.repeatUntilDone = exports.formatTokenAmountOnly = exports.splitListIntoChunks = exports.personalizeStep = exports.sleep = exports.deepClone = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethers_1 = require("ethers");
const connectors_1 = require("../connectors");
const deepClone = (src) => {
    return JSON.parse(JSON.stringify(src));
};
exports.deepClone = deepClone;
const sleep = (mills) => {
    return new Promise((resolve) => {
        setTimeout(resolve, mills);
    });
};
exports.sleep = sleep;
const personalizeStep = (signer, step) => __awaiter(void 0, void 0, void 0, function* () {
    if (step.action.toAddress && step.action.fromAddress) {
        return step;
    }
    const address = yield signer.getAddress();
    const fromAddress = step.action.fromAddress || address;
    const toAddress = step.action.toAddress || address;
    return Object.assign(Object.assign({}, step), { action: Object.assign(Object.assign({}, step.action), { fromAddress,
            toAddress }) });
});
exports.personalizeStep = personalizeStep;
const splitListIntoChunks = (list, chunkSize) => list.reduce((resultList, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!resultList[chunkIndex]) {
        resultList[chunkIndex] = []; // start a new chunk
    }
    resultList[chunkIndex].push(item);
    return resultList;
}, []);
exports.splitListIntoChunks = splitListIntoChunks;
const formatTokenAmountOnly = (token, amount) => {
    if (!amount) {
        return '0.0';
    }
    let floated;
    if (typeof amount === 'string') {
        if (amount === '0') {
            return '0.0';
        }
        floated = new bignumber_js_1.default(amount).shiftedBy(-token.decimals);
    }
    else {
        floated = amount;
        if (floated.isZero()) {
            return '0.0';
        }
    }
    // show at least 4 decimal places and at least two non-zero digests
    let decimalPlaces = 3;
    while (floated.lt(1 / Math.pow(10, decimalPlaces))) {
        decimalPlaces++;
    }
    return floated.toFixed(decimalPlaces + 1, 1);
};
exports.formatTokenAmountOnly = formatTokenAmountOnly;
/**
 * Repeatedly calls a given asynchronous function until it resolves with a value
 * @param toRepeat The function that should be repeated
 * @param timeout The timeout in milliseconds between retries, defaults to 5000
 * @returns The result of the toRepeat function
 */
const repeatUntilDone = (toRepeat, timeout = 5000) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    while (!result) {
        result = yield toRepeat();
        if (!result) {
            yield (0, exports.sleep)(timeout);
        }
    }
    return result;
});
exports.repeatUntilDone = repeatUntilDone;
/**
 * Loads a transaction receipt using the rpc for the given chain id
 * @param chainId The chain id where the transaction should be loaded from
 * @param txHash The hash of the transaction
 * @returns TransactionReceipt
 */
const loadTransactionReceipt = (chainId, txHash) => __awaiter(void 0, void 0, void 0, function* () {
    const rpc = yield (0, connectors_1.getRpcProvider)(chainId);
    const tx = yield rpc.getTransaction(txHash);
    return tx.wait();
});
exports.loadTransactionReceipt = loadTransactionReceipt;
const isZeroAddress = (address) => {
    if (address === ethers_1.constants.AddressZero ||
        address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        return true;
    }
    return false;
};
exports.isZeroAddress = isZeroAddress;
const isNativeTokenAddress = (address) => {
    if (address === ethers_1.constants.AddressZero ||
        address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ||
        // CELO native token
        address === '0x471ece3750da237f93b8e339c536989b8978a438') {
        return true;
    }
    return false;
};
exports.isNativeTokenAddress = isNativeTokenAddress;
