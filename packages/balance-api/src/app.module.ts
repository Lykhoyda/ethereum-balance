import { Module } from '@nestjs/common';
import { RpcModule } from './rpc/rpc.module';
import { BalanceModule } from './balance/balance.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), RpcModule, BalanceModule],
})
export class AppModule {}
