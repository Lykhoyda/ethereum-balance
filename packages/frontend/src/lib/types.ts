/**
 * Token types that are specifically tracked in the application
 */
export const KNOWN_TOKEN_TYPES = {
  ETH: 'ETH',
  USDC: 'USDC',
  LINK: 'LINK'
} as const

/**
 * Standard token interface with formatted values for display
 * @property symbol - Token symbol (e.g. ETH, USDC)
 * @property balance - Formatted balance with proper decimals
 * @property decimals - Number of decimal places for the token
 * @property address - Optional contract address for ERC20 tokens (null for native ETH)
 */
export interface TokenBalance {
  readonly symbol: string
  readonly balance: number
  readonly decimals: number
  readonly address: string | null
}

/**
 * Interface for raw token balance from API before processing
 * Maintains string format for balance to preserve precision before formatting
 */
export interface ApiTokenBalance {
  readonly symbol: string
  readonly balance: string
  readonly decimals: number
  readonly address?: string | null
}

/**
 * Interface for the processed balance response used in UI
 */
export interface BalanceResponse {
  readonly address: string
  readonly balances: TokenBalance[]
}

/**
 * Interface for the raw balance response from API
 */
export interface ApiBalanceResponse {
  readonly address: string
  readonly balances: ApiTokenBalance[]
  readonly timestamp: number
}
