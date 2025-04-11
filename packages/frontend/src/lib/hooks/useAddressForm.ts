import { useState, FormEvent } from 'react'
import { isAddress } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { fetchAddressBalance, isApiError } from '../api'
import { parseBalanceResponse } from '../balance'
import type { BalanceResponse } from '../types'

export function useAddressForm() {
  const [inputValue, setInputValue] = useState('')
  const [submittedAddress, setSubmittedAddress] = useState('')

  // Simple derived state instead of useMemo
  const isValidAddress = !!inputValue && isAddress(inputValue)

  const {
    data: balances,
    isLoading,
    error: queryError,
    isError,
    isSuccess
  } = useQuery({
    queryKey: ['balances', submittedAddress],
    queryFn: async (): Promise<BalanceResponse> => {
      if (!submittedAddress) {
        throw new Error('No address provided')
      }

      // Address validation is now handled in the fetchAddressBalance function
      const data = await fetchAddressBalance(submittedAddress)
      return parseBalanceResponse(data)
    },
    enabled: Boolean(submittedAddress) && isAddress(submittedAddress),
    retry: 1,
    refetchOnWindowFocus: false
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isAddress(inputValue)) {
      setSubmittedAddress(inputValue)
    }
  }

  // Derive error message directly
  const errorMessage = isError && queryError
    ? isApiError(queryError)
      ? queryError.message
      : queryError instanceof Error
        ? queryError.message
        : 'An unexpected error occurred'
    : null

  return {
    inputValue,
    setInputValue,
    submittedAddress,
    isValidAddress,
    balances,
    isLoading,
    isError,
    isSuccess,
    errorMessage,
    handleSubmit
  }
}
