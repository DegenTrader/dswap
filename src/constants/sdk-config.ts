import { BLOCKCHAIN_NAME, Configuration } from 'rubic-sdk';

export const configuration: Configuration = {
    rpcProviders: {
        [BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN]: {
            mainRpc: 'https://bsc-dataseed.binance.org/'
        },
        [BLOCKCHAIN_NAME.POLYGON]: {
            mainRpc: 'https://polygon-rpc.com'
        },
        [BLOCKCHAIN_NAME.AVALANCHE]: {
            mainRpc: 'https://api.avax.network/ext/bc/C/rpc'
        },
        [BLOCKCHAIN_NAME.ETHEREUM]: {
            mainRpc: 'https://mainnet.infura.io/v3/'
        },


    }
}
