import { AbiItem } from 'web3-utils';
interface DecodedData {
    name: string;
    params: {
        name: string;
        value: string;
        type: string;
    }[];
}
export declare class MethodDecoder {
    static decodeMethod(abiItem: AbiItem, data: string): DecodedData;
}
export {};
