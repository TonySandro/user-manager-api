import {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "../../../../data/protocols/database";
import { AddAccountRepository } from "../../../../data/protocols/database/add-account-repository";
import { GetAllAccountsRepository } from "../../../../data/protocols/database/get-all-accounts-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AppDataSource } from "../../../../main/config/typeorm.config";
import { MysqlHelper } from "../helper/mysql-helper";
import { EmailTokenGenerator } from "../helper/token-generator-helper";

export class AccountMysqlRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository,
    GetAllAccountsRepository
{
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountRepository = AppDataSource.getRepository(AccountModel);
    const { token, expiresAt } = EmailTokenGenerator.generate();

    const newAccount = accountRepository.create({
      ...account,
      isConfirmed: false,
      emailConfirmationToken: token,
      emailConfirmationExpiresAt: expiresAt,
    });

    return await accountRepository.save(newAccount);
  }

  async loadByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MysqlHelper.getRepository(AccountModel);
    const account = await accountCollection.findOne({ where: { email } });
    return account;
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MysqlHelper.getRepository(AccountModel);
    await accountCollection.update(id, { accessToken: token });
  }

  async getAllAccounts(): Promise<AccountModel[]> {
    const accountCollection = await MysqlHelper.getRepository(AccountModel);
    return await accountCollection.find();
  }
}
