import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  createTestApp,
  closeTestApp,
  TestAppContext,
} from './utils/test-app.utils';

describe('App (e2e)', () => {
  let context: TestAppContext;
  let app: INestApplication;

  beforeEach(async () => {
    context = await createTestApp();
    app = context.app;
  });

  afterEach(async () => {
    await closeTestApp(app);
  });

  it('should return 404 for non-existent routes', () => {
    return request(app.getHttpServer()).get('/').expect(HttpStatus.NOT_FOUND);
  });

  it('should have the /api/balance endpoint available', () => {
    // We just test that the endpoint exists, without providing an address
    // This should return a 400 bad request rather than a 404 not found
    return request(app.getHttpServer())
      .get('/api/balance')
      .expect(HttpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toContain('Missing "address" query parameter');
      });
  });
});
