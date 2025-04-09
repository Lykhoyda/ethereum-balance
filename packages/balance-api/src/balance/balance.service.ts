import { Inject, Injectable, Logger } from '@nestjs/common';
import { PublicClient } from 'viem';
import {
  BalanceResponse,
  TokenBalance,
  TokenConfig,
} from './interfaces/token-balance.interface';
import ERC20_ABI from '../utils/ERC20ABI';
import { RPC_PROVIDER_CLIENT } from '../rpc/rpc.module';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);
  private readonly tokens: TokenConfig[] = [
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

  constructor(
    @Inject(RPC_PROVIDER_CLIENT)
    private readonly client: PublicClient,
  ) {}

  async getTokenBalances(address: `0x${string}`): Promise<BalanceResponse> {
    const balancePromises = this.tokens.map(
      async (token): Promise<TokenBalance | null> => {
        try {
          let rawBalance: bigint;

          // Get Balance for Native ETH Token
          if (token.symbol === 'ETH') {
            rawBalance = await this.client.getBalance({ address });
          } else {
            rawBalance = (await this.client.readContract({
              address: token.address!,
              abi: ERC20_ABI,
              functionName: 'balanceOf',
              args: [address],
            })) as bigint;
          }

          return {
            ...token,
            balance: rawBalance.toString(),
          };
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          const errorStack = error instanceof Error ? error.stack : undefined;

          this.logger.error(
            `Failed to fetch ${token.symbol} balance for ${address}: ${errorMessage}`,
            errorStack,
          );
          return null;
        }
      },
    );

    const results = await Promise.all(balancePromises);

    // Filter balances that are failed to be fetched
    const validResults = results.filter((result) => result !== null);

    return {
      address,
      balances: validResults,
      timestamp: Date.now(),
    };
  }
}
