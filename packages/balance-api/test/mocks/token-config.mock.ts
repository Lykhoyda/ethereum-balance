import { TokenConfig } from '../../src/balance/interfaces/token-balance.interface';

// Mock token configurations that mirror the ones in tokens.config.ts
export const MOCK_TOKENS: TokenConfig[] = [
  { symbol: 'ETH', decimals: 18 },
  {
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  {
    symbol: 'LINK',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    decimals: 18,
  },
];

// Mock balances for testing
export const mockBalanceResponses = {
  ETH: BigInt(1000000000000000000), // 1 ETH
  USDC: BigInt(2000000), // 2 USDC (6 decimals)
  LINK: BigInt(3000000000000000000), // 3 LINK
};

// Mock client factory
export const createMockPublicClient = () => {
  return {
    getBalance: jest.fn().mockResolvedValue(mockBalanceResponses.ETH),
    readContract: jest.fn((params) => {
      // Return different values based on the contract address
      if (params.address === MOCK_TOKENS[1].address) {
        return Promise.resolve(mockBalanceResponses.USDC);
      } else if (params.address === MOCK_TOKENS[2].address) {
        return Promise.resolve(mockBalanceResponses.LINK);
      }
      return Promise.resolve(BigInt(0));
    }),
  };
};
