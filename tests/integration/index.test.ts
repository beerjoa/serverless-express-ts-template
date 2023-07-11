import express from 'express';
import httpStatus from 'http-status';
import request from 'supertest';

import App from '@src/app';

describe('index', () => {
  let testApp: express.Application;

  const { app } = new App();
  beforeAll(() => {
    testApp = app;
  });

  describe('get index route', () => {
    it('should return 200 & valid response', async () => {
      await request(testApp)
        .get('/api')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            httpCode: httpStatus.OK,
            name: 'OKResponse',
            message: 'Success Response',
            data: { message: 'Hello World' }
          });
        });
    });
  });
});
