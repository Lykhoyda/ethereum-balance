import type {
  ApiBalanceResponse,
  BalanceResponse,
  ApiTokenBalance,
  TokenBalance
} from './types'
import { formatUnits } from 'viem'

/**
 * Converts raw API balance response to a properly formatted balance response with decimal adjustments
 * @param response - Raw balance response from API
 * @returns Formatted balance response for UI consumption
 */
export function parseBalanceResponse(
  response: ApiBalanceResponse
): BalanceResponse {
  const processedBalances = response.balances.map(processTokenBalance)

  return {
    address: response.address,
    balances: processedBalances
  }
}

/**
 * Processes a single token from API response into the enhanced TokenBalance format
 * @param token - Raw token data from API
 * @returns Processed TokenBalance with proper formatting and additional properties
 */
function processTokenBalance(token: ApiTokenBalance): TokenBalance {
  const balance = parseRawBalance(token.balance, token.decimals)

  return {
    symbol: token.symbol,
    balance,
    decimals: token.decimals,
    address: token.address || null
  }
}

/**
 * Converts a raw balance string to a decimal-adjusted number using Viem formatUnits
 * @param rawBalance - Raw balance as string from blockchain
 * @param decimals - Number of decimals to apply
 * @returns Decimal-adjusted balance as number
 */
export function parseRawBalance(rawBalance: string, decimals: number): number {
  if (!rawBalance || rawBalance === '0' || rawBalance === '0x0') {
    return 0
  }

  try {
    return Number(formatUnits(BigInt(rawBalance), decimals))
  } catch (error) {
    console.error('Error parsing raw balance:', error)
    return 0
  }
}

/**
 * Truncates a floating number to the specified number of decimals (no rounding).
 * Example: truncateDecimal(1.234567, 2) => 1.23
 */
function truncateDecimal(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.trunc(value * factor) / factor
}

/**
 * Converts a truncated number into a locale-aware string.
 * Ensures exactly `decimals` digits after the decimal (by padding with zeros if needed).
 */
function formatTruncatedLocale(
  value: number,
  decimals: number,
  locale: string
): string {
  const truncated = truncateDecimal(value, decimals)

  // Split into integer and fractional parts
  const [intPart, fracPart = ''] = truncated.toString().split('.')

  // Format the integer part with thousand separators (locale-based)
  const formattedInt = parseInt(intPart, 10).toLocaleString(locale)

  if (decimals === 0) {
    return formattedInt
  }

  // Pad the fraction so we always have `decimals` digits
  const paddedFrac = fracPart.padEnd(decimals, '0')
  return `${formattedInt}.${paddedFrac}`
}

/**
 * Formats an Ethereum balance number (in Ether, not Wei) for display, using truncation rules:
 *
 * 1) balance >= 1                => 4 decimals
 * 2) 0.0001 <= balance < 1       => 5 decimals
 * 3) 0 < balance < 0.0001        => 8 decimals
 *
 * Examples:
 *   123456.789876   => 123,456.7898
 *   0.0123456       => 0.01234
 *   0.0000123456    => 0.00001234
 */
export function formatBalance(balance: number, locale = 'en-UK'): string {
  if (!Number.isFinite(balance) || balance <= 0) {
    return '0'
  }

  if (balance >= 1) {
    return formatTruncatedLocale(balance, 4, locale)
  } else if (balance >= 0.0001) {
    return formatTruncatedLocale(balance, 5, locale)
  } else {
    return formatTruncatedLocale(balance, 8, locale)
  }
}
