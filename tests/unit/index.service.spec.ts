import IndexService from '@src/index.service';

describe('IndexService', () => {
  const indexService = new IndexService('MockRepository');

  it('should be defined', () => {
    expect(indexService).toBeDefined();
  });

  describe('when calling index', () => {
    it('should be defined', () => {
      expect(indexService.index).toBeDefined();
    });

    it('should return Hello World', async () => {
      await expect(indexService.index()).resolves.toMatchObject({
        message: 'Hello World'
      });
    });
  });
});
