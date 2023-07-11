import { getMockReq, getMockRes } from '@jest-mock/express';
import httpStatus from 'http-status';

import { HttpResponseDto } from '@src/dtos/response.dto';
import IndexController from '@src/index.controller';
import IndexService from '@src/index.service';

describe('IndexController', () => {
  let controller: IndexController;
  let service: jest.Mocked<IndexService>;

  beforeEach(async () => {
    service = new IndexService('MockRepo') as jest.Mocked<IndexService>;
    controller = new IndexController(service);
  });

  describe('when calling index', () => {
    it('should be defined', () => {
      expect(controller.index).toBeDefined();
    });

    it('should return 200 & valid response', async () => {
      service.index = jest.fn().mockResolvedValue({ message: 'Hello World' });
      const req = getMockReq({});
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      });

      req;
      next;

      const result = await controller.index(res);
      expect(result).toBeInstanceOf(HttpResponseDto);
      expect(result).toMatchObject({
        httpCode: httpStatus.OK,
        name: 'OKResponse',
        message: 'Success Response',
        data: { message: 'Hello World' }
      });
      clearMockRes();
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
