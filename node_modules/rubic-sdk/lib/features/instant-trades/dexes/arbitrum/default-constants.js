"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultArbitrumProviderConfiguration = void 0;
var defaultArbitrumRoutingProvidersAddresses = [
    '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    '0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a',
    '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55',
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    '0x32eb7902d4134bf98a28b963d26de779af92a212',
    '0x539bde0d7dbd336b79148aa742883198bbf60342' // MAGIC
];
var defaultArbitrumWethAddress = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
exports.defaultArbitrumProviderConfiguration = {
    maxTransitTokens: 1,
    routingProvidersAddresses: defaultArbitrumRoutingProvidersAddresses,
    wethAddress: defaultArbitrumWethAddress
};
//# sourceMappingURL=default-constants.js.map