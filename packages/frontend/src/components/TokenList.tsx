import type { BalanceResponse } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import TokenCard from './TokenCard'

interface TokenListProps {
  data: BalanceResponse
}

/**
 * Component for displaying a list of token balances
 */
export function TokenList({ data }: TokenListProps) {
  if (!data || !data.balances.length) {
    return null
  }

  return (
    <div className="mt-8 space-y-4 animate-in fade-in-50 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Token Balances</h2>
          <Badge variant="secondary" className="ml-2">
            {data.balances.length} tokens
          </Badge>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.balances.map((token, index) => (
          <TokenCard
            key={`${token.address || token.symbol}-${index}`}
            token={token}
          />
        ))}
      </div>
    </div>
  )
}

export default TokenList
