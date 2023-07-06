// import { Model, Repository } from 'sequelize-typescript';
import { Service } from "typedi";

// import { sequelize } from '@/config/database';
import { IService } from "@/interfaces/service.interface";
// import User from '@/users/user.entity';

/**
 * Index Service
 * @class
 * @implements {IService}
 */
@Service()
class IndexService implements IService {
  // prettier-ignore
  constructor(
    public readonly repository: any//Repository<Model<User>> = sequelize.getRepository(User),  // temp
  ) {}
  public async index(): Promise<any> {
    return { message: "Hello World" };
  }
}

export default IndexService;
