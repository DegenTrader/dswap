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
import { Contract } from 'ethers';
import ChainsService from '../services/ChainsService';
import { ERC20_ABI } from '../types';
import { ServerError } from '../utils/errors';
import { fetchDataUsingMulticall } from '../utils/multicall';
export const getApproved = (signer, tokenAddress, contractAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const signerAddress = yield signer.getAddress();
    const erc20 = new Contract(tokenAddress, ERC20_ABI, signer);
    try {
        const approved = yield erc20.allowance(signerAddress, contractAddress);
        return new BigNumber(approved.toString());
    }
    catch (e) {
        return new BigNumber(0);
    }
});
export const setApproval = (signer, tokenAddress, contractAddress, amount) => {
    const erc20 = new Contract(tokenAddress, ERC20_ABI, signer);
    return erc20.approve(contractAddress, amount);
};
export const getAllowanceViaMulticall = (signer, chainId, tokenData) => __awaiter(void 0, void 0, void 0, function* () {
    const chainsService = ChainsService.getInstance();
    const chain = yield chainsService.getChainById(chainId);
    if (!chain.multicallAddress) {
        throw new ServerError(`No multicall address configured for chainId ${chainId}.`);
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
    const result = yield fetchDataUsingMulticall(calls, ERC20_ABI, chainId, chain.multicallAddress);
    if (!result.length) {
        throw new ServerError(`Couldn't load allowance from chainId ${chainId} using multicall.`);
    }
    const parsedResult = result.map(({ data }) => {
        var _a;
        return ({
            approvalAmount: (_a = data) !== null && _a !== void 0 ? _a : new BigNumber(0),
        });
    });
    return tokenData.map(({ token, approvalAddress }, i) => ({
        token,
        approvalAddress,
        approvedAmount: parsedResult[i].approvalAmount,
    }));
});
export const groupByChain = (tokenDataList) => {
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
