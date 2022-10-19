var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BigNumber from 'bignumber.js';
import { constants } from 'ethers';
import { getRpcProvider } from '../connectors';
export const deepClone = (src) => {
    return JSON.parse(JSON.stringify(src));
};
export const sleep = (mills) => {
    return new Promise((resolve) => {
        setTimeout(resolve, mills);
    });
};
export const personalizeStep = (signer, step) => __awaiter(void 0, void 0, void 0, function* () {
    if (step.action.toAddress && step.action.fromAddress) {
        return step;
    }
    const address = yield signer.getAddress();
    const fromAddress = step.action.fromAddress || address;
    const toAddress = step.action.toAddress || address;
    return Object.assign(Object.assign({}, step), { action: Object.assign(Object.assign({}, step.action), { fromAddress,
            toAddress }) });
});
export const splitListIntoChunks = (list, chunkSize) => list.reduce((resultList, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!resultList[chunkIndex]) {
        resultList[chunkIndex] = []; // start a new chunk
    }
    resultList[chunkIndex].push(item);
    return resultList;
}, []);
export const formatTokenAmountOnly = (token, amount) => {
    if (!amount) {
        return '0.0';
    }
    let floated;
    if (typeof amount === 'string') {
        if (amount === '0') {
            return '0.0';
        }
        floated = new BigNumber(amount).shiftedBy(-token.decimals);
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
/**
 * Repeatedly calls a given asynchronous function until it resolves with a value
 * @param toRepeat The function that should be repeated
 * @param timeout The timeout in milliseconds between retries, defaults to 5000
 * @returns The result of the toRepeat function
 */
export const repeatUntilDone = (toRepeat, timeout = 5000) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    while (!result) {
        result = yield toRepeat();
        if (!result) {
            yield sleep(timeout);
        }
    }
    return result;
});
/**
 * Loads a transaction receipt using the rpc for the given chain id
 * @param chainId The chain id where the transaction should be loaded from
 * @param txHash The hash of the transaction
 * @returns TransactionReceipt
 */
export const loadTransactionReceipt = (chainId, txHash) => __awaiter(void 0, void 0, void 0, function* () {
    const rpc = yield getRpcProvider(chainId);
    const tx = yield rpc.getTransaction(txHash);
    return tx.wait();
});
export const isZeroAddress = (address) => {
    if (address === constants.AddressZero ||
        address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        return true;
    }
    return false;
};
export const isNativeTokenAddress = (address) => {
    if (address === constants.AddressZero ||
        address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ||
        // CELO native token
        address === '0x471ece3750da237f93b8e339c536989b8978a438') {
        return true;
    }
    return false;
};
