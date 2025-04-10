import { TOKENS } from '../../src/config/tokens.config';

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
      if (params.address === TOKENS[1].address) {
        return Promise.resolve(mockBalanceResponses.USDC);
      } else if (params.address === TOKENS[2].address) {
        return Promise.resolve(mockBalanceResponses.LINK);
      }
      return Promise.resolve(BigInt(0));
    }),
  };
};
