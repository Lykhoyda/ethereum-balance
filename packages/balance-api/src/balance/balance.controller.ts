import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { isAddress } from 'viem';
import { BalanceService } from './balance.service';

@Controller('api')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('balance')
  async getBalance(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('Missing "address" query parameter');
    }

    if (!isAddress(address)) {
      throw new BadRequestException('Invalid Ethereum address format');
    }

    try {
      const balanceData = await this.balanceService.getTokenBalances(address);

      // If no balances were retrieved successfully, return error
      if (balanceData.balances.length === 0) {
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
          : `Failed to retrieve balances ${String(error)}`;

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
