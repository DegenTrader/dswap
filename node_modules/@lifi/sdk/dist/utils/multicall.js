var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { getRpcProvider } from '../connectors';
import { splitListIntoChunks } from './utils';
import MULTICALL_ABI from './multicallAbi.json';
const MAX_MULTICALL_SIZE = 100;
export const fetchDataUsingMulticall = (calls, abi, chainId, multicallAddress, requireSuccess = false) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. create contract using multicall contract address and abi...
    const provider = yield getRpcProvider(chainId);
    const multicallContract = new Contract(multicallAddress, MULTICALL_ABI, provider);
    const abiInterface = new Interface(abi);
    // split up lists into chunks to stay below multicall limit
    const chunkedList = splitListIntoChunks(calls, MAX_MULTICALL_SIZE);
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
