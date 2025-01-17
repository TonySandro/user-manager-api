import {
  LoadUserByEmailRepository,
  UpdateAccessTokenRepository,
} from "../../../../data/protocols/database";
import { AddUserRepository } from "../../../../data/protocols/database/add-user-repository";
import { UserModel } from "../../../../domain/models/user";
import { AddUserModel } from "../../../../domain/usecases/add-user";
import { AppDataSource } from "../../../../main/config/typeorm.config";
import { MysqlHelper } from "../helper/mysql-helper";

export class UserMysqlRepository
  implements
    AddUserRepository,
    LoadUserByEmailRepository,
    UpdateAccessTokenRepository
{
  async add(user: AddUserModel): Promise<UserModel> {
    const userRepository = AppDataSource.getRepository(UserModel);

    const newUser = userRepository.create(user);

    return await userRepository.save(newUser);
  }

  async loadByEmail(email: string): Promise<UserModel> {
    const userCollection = await MysqlHelper.getRepository(UserModel);
    const user = await userCollection.findOne({ where: { email } });
    return user;
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const userCollection = await MysqlHelper.getRepository(UserModel);
    await userCollection.update(id, { accessToken: token });
  }
}
