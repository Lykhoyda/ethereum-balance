export interface TokenConfig {
  symbol: string;
  address?: `0x${string}`;
  decimals: number;
}

export interface TokenBalance extends TokenConfig {
  balance: string;
}

export interface BalanceResponse {
  address: string;
  balances: TokenBalance[];
  timestamp: number;
}
