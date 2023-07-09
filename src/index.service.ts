import { Service } from 'typedi';

import { IService } from '@src/interfaces/service.interface';

/**
 * Index Service
 * @class
 * @implements {IService}
 */
@Service()
class IndexService implements IService {
  // prettier-ignore
  constructor(
    public readonly repository: any
  ) {}
  public async index(): Promise<any> {
    return { message: 'Hello World' };
  }
}

export default IndexService;
