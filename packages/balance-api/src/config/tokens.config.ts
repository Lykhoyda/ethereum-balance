import { TokenConfig } from '../balance/interfaces/token-balance.interface';

/**
 * Configuration for tokens supported by the balance API
 */
export const TOKENS: TokenConfig[] = [
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
