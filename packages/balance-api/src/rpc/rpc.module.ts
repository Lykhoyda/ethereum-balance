import { Module, Global } from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const RPC_PROVIDER_CLIENT = 'RPC_PROVIDER_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: RPC_PROVIDER_CLIENT,
      useFactory: () => {
        const INFURA_URL = process.env.INFURA_URL;
        if (!INFURA_URL) {
          throw new Error('Missing INFURA_URL environment variable');
        }
        return createPublicClient({
          chain: mainnet,
          transport: http(INFURA_URL),
        });
      },
    },
  ],
  exports: [RPC_PROVIDER_CLIENT],
})
export class RpcModule {}
