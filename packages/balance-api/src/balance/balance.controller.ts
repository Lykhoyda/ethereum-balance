import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { isAddress } from 'viem';
import { BalanceService } from './balance.service';
import { BalanceResponse } from './interfaces/token-balance.interface';

@Controller('api')
export class BalanceController {
  private readonly logger = new Logger(BalanceController.name);

  constructor(private readonly balanceService: BalanceService) {}

  @Get('balance')
  async getBalance(
    @Query('address') address: string,
  ): Promise<BalanceResponse> {
    this.validateAddress(address);

    try {
      const balanceData = await this.balanceService.getTokenBalances(
        address as `0x${string}`,
      );

      if (balanceData.balances.length === 0) {
        this.logger.error(
          `No token balances retrieved for address: ${address}`,
        );
        throw new HttpException(
          `Unable to retrieve any token balances for address: ${address}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return balanceData;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to retrieve balances: ${String(error)}`;

      this.logger.error(`Error retrieving balances: ${errorMessage}`);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Validates an Ethereum address
   *
   * @param address - Address to validate
   * @throws BadRequestException if address is missing or invalid
   */
  private validateAddress(address: string): void {
    if (!address) {
      this.logger.warn('Request missing address parameter');
      throw new BadRequestException('Missing "address" query parameter');
    }

    if (!isAddress(address)) {
      this.logger.warn(`Invalid address format: ${address}`);
      throw new BadRequestException('Invalid Ethereum address format');
    }
  }
}
