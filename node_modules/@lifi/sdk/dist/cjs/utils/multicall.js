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
exports.fetchDataUsingMulticall = void 0;
const abi_1 = require("@ethersproject/abi");
const contracts_1 = require("@ethersproject/contracts");
const connectors_1 = require("../connectors");
const utils_1 = require("./utils");
const multicallAbi_json_1 = __importDefault(require("./multicallAbi.json"));
const MAX_MULTICALL_SIZE = 100;
const fetchDataUsingMulticall = (calls, abi, chainId, multicallAddress, requireSuccess = false) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. create contract using multicall contract address and abi...
    const provider = yield (0, connectors_1.getRpcProvider)(chainId);
    const multicallContract = new contracts_1.Contract(multicallAddress, multicallAbi_json_1.default, provider);
    const abiInterface = new abi_1.Interface(abi);
    // split up lists into chunks to stay below multicall limit
    const chunkedList = (0, utils_1.splitListIntoChunks)(calls, MAX_MULTICALL_SIZE);
    const chunkedResults = yield Promise.all(chunkedList.map((chunkedCalls) => __awaiter(void 0, void 0, void 0, function* () {
        const callData = chunkedCalls.map((call) => [
            call.address.toLowerCase(),
            abiInterface.encodeFunctionData(call.name, call.params),
        ]);
        try {
            // 3. get bytes array from multicall contract by process aggregate method...
            const { blockNumber, returnData } = yield multicallContract.tryBlockAndAggregate(requireSuccess, callData);
            // 4. decode bytes array to useful data array...
            return returnData
                .map(({ success, returnData }, i) => {
                if (!success) {
                    // requested function failed
                    console.error(`Multicall unsuccessful for address "${chunkedCalls[i].address}", ` +
                        `function "${chunkedCalls[i].name}", chainId "${chainId}"`);
                    return [];
                }
                if (returnData.toString() === '0x') {
                    // requested function does probably not exist
                    console.error(`Multicall no response for address "${chunkedCalls[i].address}", ` +
                        `function "${chunkedCalls[i].name}", chainId "${chainId}"`);
                    return [];
                }
                try {
                    return abiInterface.decodeFunctionResult(chunkedCalls[i].name, returnData);
                }
                catch (e) {
                    // requested function returns other data than expected
                    console.error(`Multicall parsing unsuccessful for address "${chunkedCalls[i].address}", ` +
                        `function "${chunkedCalls[i].name}", chainId "${chainId}"`);
                    return [];
                }
            })
                .map((data) => {
                return {
                    data: data[0],
                    blockNumber: blockNumber.toNumber(),
                };
            });
        }
        catch (e) {
            // whole rpc call failed, probably an rpc issue
            console.error(`Multicall failed on chainId "${chainId}"`, chunkedList, e);
            return [];
        }
    })));
    return chunkedResults.flat();
});
exports.fetchDataUsingMulticall = fetchDataUsingMulticall;
