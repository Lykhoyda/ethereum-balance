import { Input } from './ui/input'
import { Button } from './ui/button'
import { LoadingSpinner } from './ui/loading-spinner'
import { Alert } from './ui/alert'
import { cn } from '@/lib/utils'
import { FormEvent } from 'react'
import { isAddress } from 'viem'

interface AddressInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
  isLoading: boolean
  errorMessage: string | null
  className?: string
}

/**
 * Component for inputting and validating Ethereum addresses
 */
function AddressInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  errorMessage,
  className
}: AddressInputProps) {
  const isValidAddress = value && isAddress(value)
  
  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="text"
            placeholder="Enter Ethereum address (0x...)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              'flex-1',
              errorMessage ? 'border-red-500 focus-visible:ring-red-500' : ''
            )}
            aria-label="Ethereum address"
            disabled={isLoading}
            aria-invalid={!!errorMessage}
          />
          <Button
            type="submit"
            disabled={isLoading || !value.trim() || !isValidAddress}
            aria-busy={isLoading}
            className="min-w-[140px]"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Checking...
              </>
            ) : (
              'Check Balance'
            )}
          </Button>
        </div>

        {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
        {value && !isValidAddress && (
          <Alert variant="error">Please enter a valid Ethereum address</Alert>
        )}
      </form>
    </div>
  )
}

export default AddressInput
