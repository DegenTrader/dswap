var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { providers } from 'ethers';
import { getRandomNumber, ServerError } from '.';
import { ChainId } from './types';
import ConfigService from './services/ConfigService';
// cached providers
const chainProviders = {};
// Archive RPC Provider
const archiveRpcs = {
    [ChainId.ETH]: 'https://speedy-nodes-nyc.moralis.io/5ed6053dc39eba789ff466c9/eth/mainnet/archive',
    [ChainId.BSC]: 'https://speedy-nodes-nyc.moralis.io/5ed6053dc39eba789ff466c9/bsc/mainnet/archive',
    [ChainId.POL]: 'https://speedy-nodes-nyc.moralis.io/5ed6053dc39eba789ff466c9/polygon/mainnet/archive',
    [ChainId.FTM]: 'https://speedy-nodes-nyc.moralis.io/5ed6053dc39eba789ff466c9/fantom/mainnet',
};
// RPC Urls
export const getRpcUrl = (chainId, archive = false) => __awaiter(void 0, void 0, void 0, function* () {
    const rpcUrls = yield getRpcUrls(chainId, archive);
    return rpcUrls[0];
});
export const getRpcUrls = (chainId, archive = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (archive && archiveRpcs[chainId]) {
        return [archiveRpcs[chainId]];
    }
    const configService = ConfigService.getInstance();
    const config = yield configService.getConfigAsync();
    return config.rpcs[chainId];
});
const getRandomProvider = (providerList) => {
    const index = getRandomNumber(0, providerList.length - 1);
    return providerList[index];
};
// Provider
export const getRpcProvider = (chainId, archive = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (archive && archiveRpcs[chainId]) {
        // return archive PRC, but don't cache it
        return new providers.FallbackProvider([
            new providers.StaticJsonRpcProvider(yield getRpcUrl(chainId, archive), chainId),
        ]);
    }
    if (!chainProviders[chainId]) {
        chainProviders[chainId] = [];
        const urls = yield getRpcUrls(chainId, archive);
        urls.forEach((url) => {
            chainProviders[chainId].push(new providers.FallbackProvider([
                new providers.StaticJsonRpcProvider(url, chainId),
            ]));
        });
    }
    if (!chainProviders[chainId].length) {
        throw new ServerError(`Unable to configure provider for chain ${chainId}`);
    }
    return getRandomProvider(chainProviders[chainId]);
});
// Multicall
export const getMulticallAddress = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const configService = ConfigService.getInstance();
    const config = yield configService.getConfigAsync();
    return config.multicallAddresses[chainId];
});
