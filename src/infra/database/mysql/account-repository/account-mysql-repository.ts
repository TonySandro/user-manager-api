import {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from "../../../../data/protocols/database";
import { AddAccountRepository } from "../../../../data/protocols/database/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { AppDataSource } from "../../../../main/config/typeorm.config";
import { MysqlHelper } from "../helper/mysql-helper";

export class AccountMysqlRepository
  implements
    AddAccountRepository,
    LoadAccountByEmailRepository,
    UpdateAccessTokenRepository
{
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountRepository = AppDataSource.getRepository(AccountModel);

    const newAccount = accountRepository.create(account);

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
}
