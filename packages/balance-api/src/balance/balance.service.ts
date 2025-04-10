import { Inject, Injectable, Logger } from '@nestjs/common';
import { PublicClient, formatUnits } from 'viem';
import {
  BalanceResponse,
  TokenBalance,
  TokenConfig,
} from './interfaces/token-balance.interface';
import ERC20_ABI from '../utils/ERC20ABI';
import { RPC_PROVIDER_CLIENT } from '../rpc/rpc.module';
import { TOKENS } from '../config/tokens.config';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    @Inject(RPC_PROVIDER_CLIENT)
    private readonly client: PublicClient,
  ) {}

  async getTokenBalances(address: `0x${string}`): Promise<BalanceResponse> {
    this.logger.log(`Fetching balances for address: ${address}`);

    // Create parallel promises for each token balance
    const balancePromises = TOKENS.map((token) =>
      this.fetchSingleTokenBalance(address, token),
    );

    const results = await Promise.all(balancePromises);

    // Filter out failed balance requests
    const validResults = results.filter(
      (result): result is TokenBalance => result !== null,
    );

    // Log the summary of results
    this.logger.log(
      `Successfully fetched ${validResults.length} of ${TOKENS.length} token balances for ${address}`,
    );

    return {
      address,
      balances: validResults,
      timestamp: Date.now(),
    };
  }

  /**
   * Fetches balance for a single token
   * Handles errors for individual token requests to ensure resilience
   *
   * @param address - The Ethereum address to fetch balance for
   * @param token - Token configuration including symbol and contract address
   * @returns TokenBalance object or null if fetch failed
   */
  private async fetchSingleTokenBalance(
    address: `0x${string}`,
    token: TokenConfig,
  ): Promise<TokenBalance | null> {
    try {
      let rawBalance: bigint;

      // Handle ETH differently than ERC20 tokens
      if (token.symbol === 'ETH') {
        rawBalance = await this.client.getBalance({ address });
      } else if (token.address) {
        // Ensure token address is defined before attempting to read contract
        rawBalance = (await this.client.readContract({
          address: token.address,
          abi: ERC20_ABI,
          functionName: 'balanceOf',
          args: [address],
        })) as bigint;
      } else {
        throw new Error(`Token ${token.symbol} has no address defined`);
      }

      this.logger.debug(
        `Fetched ${token.symbol} balance for ${address}: ${formatUnits(rawBalance, token.decimals)} ${token.symbol}`,
      );

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
  }
}
