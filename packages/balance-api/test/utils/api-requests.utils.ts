import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

/**
 * Helper function to call the balance API endpoint
 */
export const callBalanceAPI = (app: INestApplication, address?: string) => {
  const server = app.getHttpServer();
  const url = address ? `/api/balance?address=${address}` : '/api/balance';
  return request(server).get(url);
};
