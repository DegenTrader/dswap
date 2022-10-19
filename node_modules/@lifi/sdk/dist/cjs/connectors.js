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
exports.getMulticallAddress = exports.getRpcProvider = exports.getRpcUrls = exports.getRpcUrl = void 0;
const ethers_1 = require("ethers");
const _1 = require(".");
const types_1 = require("./types");
const ConfigService_1 = __importDefault(require("./services/ConfigService"));
// cached providers
const chainProviders = {};
// Archive RPC Provider
const archiveRpcs = {
    [types_1.ChainId.ETH]: 'https://speedy-nodes-nyc.moralis.io/5ed6053dc39eba789ff466c9/eth/mainnet/archive',
    [types_1.ChainId.BSC]: 'https://speedy-nodes-nyc.moralis.io/5ed6053dc39eba789ff466c9/bsc/mainnet/archive',
    [types_1.ChainId.POL]: 'https://speedy-nodes-nyc.moralis.io/5ed6053dc39eba789ff466c9/polygon/mainnet/archive',
    [types_1.ChainId.FTM]: 'https://speedy-nodes-nyc.moralis.io/5ed6053dc39eba789ff466c9/fantom/mainnet',
};
// RPC Urls
const getRpcUrl = (chainId, archive = false) => __awaiter(void 0, void 0, void 0, function* () {
    const rpcUrls = yield (0, exports.getRpcUrls)(chainId, archive);
    return rpcUrls[0];
});
exports.getRpcUrl = getRpcUrl;
const getRpcUrls = (chainId, archive = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (archive && archiveRpcs[chainId]) {
        return [archiveRpcs[chainId]];
    }
    const configService = ConfigService_1.default.getInstance();
    const config = yield configService.getConfigAsync();
    return config.rpcs[chainId];
});
exports.getRpcUrls = getRpcUrls;
const getRandomProvider = (providerList) => {
    const index = (0, _1.getRandomNumber)(0, providerList.length - 1);
    return providerList[index];
};
// Provider
const getRpcProvider = (chainId, archive = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (archive && archiveRpcs[chainId]) {
        // return archive PRC, but don't cache it
        return new ethers_1.providers.FallbackProvider([
            new ethers_1.providers.StaticJsonRpcProvider(yield (0, exports.getRpcUrl)(chainId, archive), chainId),
        ]);
    }
    if (!chainProviders[chainId]) {
        chainProviders[chainId] = [];
        const urls = yield (0, exports.getRpcUrls)(chainId, archive);
        urls.forEach((url) => {
            chainProviders[chainId].push(new ethers_1.providers.FallbackProvider([
                new ethers_1.providers.StaticJsonRpcProvider(url, chainId),
            ]));
        });
    }
    if (!chainProviders[chainId].length) {
        throw new _1.ServerError(`Unable to configure provider for chain ${chainId}`);
    }
    return getRandomProvider(chainProviders[chainId]);
});
exports.getRpcProvider = getRpcProvider;
// Multicall
const getMulticallAddress = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const configService = ConfigService_1.default.getInstance();
    const config = yield configService.getConfigAsync();
    return config.multicallAddresses[chainId];
});
exports.getMulticallAddress = getMulticallAddress;
