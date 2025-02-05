import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
} from "../add-account/db-add-account-protocols";
import { LoadAccountByEmailRepository } from "../authentication/db-authentication-protocols";

export class DbLoadAccountByEmail {
  constructor(
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async loadByEmail(email: string): Promise<AccountModel> {
    return await this.loadAccountByEmailRepository.loadByEmail(email);
  }
}
