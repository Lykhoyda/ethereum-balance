import { TokenConfig } from '../../src/balance/interfaces/token-balance.interface';
import { mockBalanceResponses } from '../mocks/token-config.mock';

/**
 * Helper function to assert the structure of a successful balance response
 */
export function assertValidBalanceResponse(
  body: any,
  address: string,
  expectedTokens: TokenConfig[],
): void {
  // Basic shape checks
  expect(body).toHaveProperty('address', address);
  expect(body).toHaveProperty('balances');
  expect(Array.isArray(body.balances)).toBe(true);

  // We expect a result for every token
  expect(body.balances.length).toBe(expectedTokens.length);

  // Check each token's fields
  expectedTokens.forEach((token) => {
    const tokenBalance = body.balances.find((b) => b.symbol === token.symbol);
    expect(tokenBalance).toBeDefined();
    expect(tokenBalance.symbol).toBe(token.symbol);
    expect(tokenBalance.decimals).toBe(token.decimals);
    expect(typeof tokenBalance.balance).toBe('string'); // Should be stringified
  });
}

/**
 * Helper function to assert the ETH balance in a response
 */
export function assertEthBalance(body: any, expectPresent = true): void {
  const ethBalance = body.balances.find((b) => b.symbol === 'ETH');

  if (expectPresent) {
    expect(ethBalance).toBeDefined();
    expect(ethBalance.balance).toBe(mockBalanceResponses.ETH.toString());
  } else {
    expect(ethBalance).toBeUndefined();
  }
}

/**
 * Helper function to assert the ERC20 token balances in a response
 */
export function assertErc20Balances(body: any, expectPresent = true): void {
  const usdcBalance = body.balances.find((b) => b.symbol === 'USDC');
  const linkBalance = body.balances.find((b) => b.symbol === 'LINK');

  if (expectPresent) {
    expect(usdcBalance).toBeDefined();
    expect(linkBalance).toBeDefined();
  } else {
    expect(usdcBalance).toBeUndefined();
    expect(linkBalance).toBeUndefined();
  }
}
