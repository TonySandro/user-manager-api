import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor(private readonly addAccountRepository: AddAccountRepository) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountRepo = await this.addAccountRepository.add(account);

    return accountRepo;
  }
}
