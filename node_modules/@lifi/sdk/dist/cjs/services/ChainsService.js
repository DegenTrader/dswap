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
const errors_1 = require("../utils/errors");
const ApiService_1 = __importDefault(require("./ApiService"));
class ChainsService {
    constructor() {
        this.chains = [];
        this.loadingPromise = this.loadAvailableChains();
    }
    loadAvailableChains() {
        return __awaiter(this, void 0, void 0, function* () {
            this.chains = yield ApiService_1.default.getChains();
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
                throw new errors_1.ValidationError(`Unknown chainId passed: ${chainId}.`);
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
exports.default = ChainsService;
