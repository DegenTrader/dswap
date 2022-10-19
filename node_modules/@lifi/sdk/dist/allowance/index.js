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
import { isSameToken } from '../helpers';
import { isNativeTokenAddress } from '../utils/utils';
import { getAllowanceViaMulticall, getApproved, groupByChain, setApproval, } from './utils';
export const getTokenApproval = (signer, token, approvalAddress) => __awaiter(void 0, void 0, void 0, function* () {
    // native token don't need approval
    if (isNativeTokenAddress(token.address)) {
        return;
    }
    const approved = yield getApproved(signer, token.address, approvalAddress);
    return approved.toString();
});
export const bulkGetTokenApproval = (signer, tokenData) => __awaiter(void 0, void 0, void 0, function* () {
    // filter out native tokens
    const filteredTokenData = tokenData.filter(({ token }) => !isNativeTokenAddress(token.address));
    // group by chain
    const tokenDataByChain = groupByChain(filteredTokenData);
    const approvalPromises = Object.keys(tokenDataByChain).map((chainId) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedChainId = Number.parseInt(chainId);
        // get allowances for current chain and token list
        return getAllowanceViaMulticall(signer, parsedChainId, tokenDataByChain[parsedChainId]);
    }));
    const approvalsByChain = yield Promise.all(approvalPromises);
    const approvals = approvalsByChain.flat();
    return tokenData.map(({ token }) => {
        // native token don't need approval
        if (isNativeTokenAddress(token.address)) {
            return { token, approval: undefined };
        }
        const approved = approvals.find((approval) => isSameToken(approval.token, token));
        return { token, approval: approved === null || approved === void 0 ? void 0 : approved.approvedAmount.toString() };
    });
});
export const approveToken = ({ signer, token, approvalAddress, amount, infiniteApproval = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    // native token don't need approval
    if (isNativeTokenAddress(token.address)) {
        return;
    }
    const approvedAmount = yield getApproved(signer, token.address, approvalAddress);
    if (new BigNumber(amount).gt(approvedAmount)) {
        const approvalAmount = infiniteApproval
            ? constants.MaxUint256.toString()
            : amount;
        const approveTx = yield setApproval(signer, token.address, approvalAddress, approvalAmount);
        yield approveTx.wait();
    }
});
export const revokeTokenApproval = ({ signer, token, approvalAddress, }) => __awaiter(void 0, void 0, void 0, function* () {
    // native token don't need approval
    if (isNativeTokenAddress(token.address)) {
        return;
    }
    const approvedAmount = yield getApproved(signer, token.address, approvalAddress);
    if (!approvedAmount.isZero()) {
        const approveTx = yield setApproval(signer, token.address, approvalAddress, '0');
        yield approveTx.wait();
    }
});
