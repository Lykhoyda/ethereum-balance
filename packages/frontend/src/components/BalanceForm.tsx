import { useAddressForm } from '@/lib/hooks/useAddressForm'
import AddressInput from './AddressInput'
import TokenList from './TokenList'

/**
 * BalanceForm component for fetching and displaying token balances
 * Refactored to use custom hooks and components for better code organization
 */
export function BalanceForm() {
  const {
    inputValue,
    setInputValue,
    balances,
    isLoading,
    isSuccess,
    errorMessage,
    handleSubmit
  } = useAddressForm()

  return (
    <div className="w-full max-w-3xl mx-auto">
      <AddressInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />

      {isSuccess && balances && <TokenList data={balances} />}
    </div>
  )
}
