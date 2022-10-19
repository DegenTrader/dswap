var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ValidationError } from '../utils/errors';
import ApiService from './ApiService';
export default class ChainsService {
    constructor() {
        this.chains = [];
        this.loadingPromise = this.loadAvailableChains();
    }
    loadAvailableChains() {
        return __awaiter(this, void 0, void 0, function* () {
            this.chains = yield ApiService.getChains();
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ChainsService();
        }
        return this.instance;
    }
    getChainById(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loadingPromise) {
                yield this.loadingPromise;
            }
            const chain = this.chains.find((chain) => chain.id === chainId);
            if (!chain) {
                throw new ValidationError(`Unknown chainId passed: ${chainId}.`);
            }
            return chain;
        });
    }
    getChains() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loadingPromise) {
                yield this.loadingPromise;
            }
            return this.chains;
        });
    }
}
