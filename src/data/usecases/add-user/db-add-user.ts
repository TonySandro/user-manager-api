import { Hasher } from "../../protocols/cryptography/hasher";
import {
  AddUser,
  AddUserModel,
  UserModel,
  AddUserRepository,
} from "./db-add-user-protocols";

export class DbAddUser implements AddUser {
  constructor(
    private readonly hasher: Hasher,
    private readonly addUserRepository: AddUserRepository
  ) {}
  async add(userData: AddUserModel): Promise<UserModel> {
    const hashedPassword = await this.hasher.hash(userData.password);
    const user = await this.addUserRepository.add(
      Object.assign({}, userData, { password: hashedPassword })
    );

    return user;
  }
}
