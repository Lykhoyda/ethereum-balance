import { Module } from '@nestjs/common';
import { RpcModule } from './rpc/rpc.module';
import { BalanceModule } from './balance/balance.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // time-to-live in milliseconds
        limit: 50,
      },
    ]),
    RpcModule,
    BalanceModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
