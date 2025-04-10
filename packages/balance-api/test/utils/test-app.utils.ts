import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { RPC_PROVIDER_CLIENT } from '../../src/rpc/rpc.module';
import { createMockPublicClient } from '../mocks/token-config.mock';

export interface TestAppContext {
  app: INestApplication;
  mockPublicClient: ReturnType<typeof createMockPublicClient>;
}

/**
 * Creates a test application with mocked RPC provider
 */
export async function createTestApp(): Promise<TestAppContext> {
  const mockPublicClient = createMockPublicClient();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        // Mock environment variables
        load: [
          () => ({
            INFURA_URL: 'https://mock-infura-url.io',
          }),
        ],
      }),
      AppModule,
    ],
  })
    .overrideProvider(RPC_PROVIDER_CLIENT)
    .useValue(mockPublicClient)
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return { app, mockPublicClient };
}

/**
 * Closes the test application
 */
export async function closeTestApp(app: INestApplication): Promise<void> {
  await app.close();
}
