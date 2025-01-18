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
  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(account.password);
    const accountRepo = await this.addAccountRepository.add(
      Object.assign({}, account, { password: hashedPassword })
    );

    return accountRepo;
  }
}
