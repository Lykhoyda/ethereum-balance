import type { TokenBalance } from '@/lib/types.ts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx'
import { formatBalance } from '@/lib/balance.ts'

interface TokenCardProps {
  token: TokenBalance
}

/**
 * TokenCard displays a single token with its balance information
 */
function TokenCard({ token }: TokenCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:hover:border-gray-700 dark:hover:shadow-black/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
              {token.symbol.substring(0, 1)}
            </div>
            <CardTitle className="text-lg">{token.symbol}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">
            {formatBalance(token.balance)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TokenCard
