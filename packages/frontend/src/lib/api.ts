import { ApiBalanceResponse } from './types'
import { getAddress, isAddress } from 'viem'

const API_BASE_URL = '/api'

/**
 * Common API error status codes
 */
export enum ApiErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  TIMEOUT = 408,
  SERVER_ERROR = 500
}

/**
 * Customized error class for API-related errors
 */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number = ApiErrorCode.SERVER_ERROR) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }

  static getMessageForStatus(status: number): string {
    switch (status) {
      case ApiErrorCode.BAD_REQUEST:
        return 'Invalid request format. Please check your input and try again.'
      case ApiErrorCode.UNAUTHORIZED:
        return 'Authentication required. Please log in and try again.'
      case ApiErrorCode.NOT_FOUND:
        return 'Resource not found. Please check your request and try again.'
      case ApiErrorCode.TIMEOUT:
        return 'Request timed out. Please try again later.'
      case ApiErrorCode.SERVER_ERROR:
        return 'Server error. Please try again later.'
      default:
        return 'An unexpected error occurred.'
    }
  }
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Validates and normalizes an Ethereum address
 *
 * @param address - Address to validate and normalize
 * @returns The checksummed address
 * @throws ApiError if address is invalid
 */
export function validateEthereumAddress(address: string): string {
  if (!isAddress(address)) {
    throw new ApiError(
      'Invalid Ethereum address format',
      ApiErrorCode.BAD_REQUEST
    )
  }

  try {
    return getAddress(address)
  } catch (error) {
    throw new ApiError(
      'Invalid Ethereum address format',
      ApiErrorCode.BAD_REQUEST
    )
  }
}

/**
 * Fetches balance information for a given Ethereum address
 *
 * @param address - Ethereum address to fetch balances for
 * @returns Promise resolving to the balance data
 * @throws ApiError if the request fails
 */
export async function fetchAddressBalance(
  address: string
): Promise<ApiBalanceResponse> {
  // Validate and normalize address
  const checksumAddress = validateEthereumAddress(address)

  const response = await fetch(
    `${API_BASE_URL}/balance?address=${checksumAddress}`
  ).catch((error) => {
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      ApiErrorCode.SERVER_ERROR
    )
  })

  if (!response.ok) {
    throw new ApiError(
      ApiError.getMessageForStatus(response.status),
      response.status
    )
  }

  return response.json()
}
