import { HttpStatus, INestApplication } from '@nestjs/common';
import { createMockPublicClient } from './mocks/token-config.mock';
import { VALID_ETH_ADDRESS, INVALID_ETH_ADDRESS } from './utils/test-constants';
import { callBalanceAPI } from './utils/api-requests.utils';
import {
  createTestApp,
  closeTestApp,
  TestAppContext,
} from './utils/test-app.utils';
import {
  assertValidBalanceResponse,
  assertEthBalance,
  assertErc20Balances,
} from './utils/test-assertions.utils';
import { TOKENS } from '../src/config/tokens.config';

describe('Balance API (e2e)', () => {
  let context: TestAppContext;
  let app: INestApplication;
  let mockPublicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(async () => {
    context = await createTestApp();
    app = context.app;
    mockPublicClient = context.mockPublicClient;
  });

  afterEach(async () => {
    await closeTestApp(app);
  });

  describe('Input Validation', () => {
    it('should return 400 if no address is provided', () => {
      return callBalanceAPI(app)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain(
            'Missing "address" query parameter',
          );
        });
    });

    it('should return 400 for an invalid Ethereum address', () => {
      return callBalanceAPI(app, INVALID_ETH_ADDRESS)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid Ethereum address format');
        });
    });
  });

  describe('Successful Balances', () => {
    it('should return token balances for a valid Ethereum address', async () => {
      const response = await callBalanceAPI(app, VALID_ETH_ADDRESS).expect(
        HttpStatus.OK,
      );

      assertValidBalanceResponse(response.body, VALID_ETH_ADDRESS, TOKENS);
      assertEthBalance(response.body);

      expect(mockPublicClient.getBalance).toHaveBeenCalledWith({
        address: VALID_ETH_ADDRESS,
      });
    });
  });

  describe('Partial Failures', () => {
    it('should skip ETH if RPC call for ETH fails', async () => {
      mockPublicClient.getBalance.mockRejectedValueOnce(new Error('RPC error'));

      const response = await callBalanceAPI(app, VALID_ETH_ADDRESS).expect(
        HttpStatus.OK,
      );

      const balances = response.body.balances;
      expect(balances.length).toBe(TOKENS.length - 1);

      assertEthBalance(response.body, false);
      assertErc20Balances(response.body);
    });

    it('should skip ERC20 tokens if their RPC calls fail', async () => {
      // Mock readContract failing for ERC20 tokens
      mockPublicClient.readContract.mockRejectedValue(new Error('RPC error'));

      const response = await callBalanceAPI(app, VALID_ETH_ADDRESS).expect(
        HttpStatus.OK,
      );

      // Only ETH remains (mocked successfully)
      const balances = response.body.balances;
      expect(balances.length).toBe(1);
      assertEthBalance(response.body);
      assertErc20Balances(response.body, false);
    });
  });

  describe('Total Failures', () => {
    it('should return 500 if all RPC calls fail', async () => {
      mockPublicClient.getBalance.mockRejectedValue(new Error('RPC error'));
      mockPublicClient.readContract.mockRejectedValue(new Error('RPC error'));

      return callBalanceAPI(app, VALID_ETH_ADDRESS)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect((res) => {
          expect(res.body.message).toContain(
            'Unable to retrieve any token balances',
          );
        });
    });
  });
});
