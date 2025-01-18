import { Hasher } from "../../protocols/cryptography/hasher";
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  async add(userData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(userData.password);
    const user = await this.addAccountRepository.add(
      Object.assign({}, userData, { password: hashedPassword })
    );

    return user;
  }
}
