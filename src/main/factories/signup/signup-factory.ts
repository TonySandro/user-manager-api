import { Controller } from "../../../presentation/protocols";
import { AccountController } from "../../../presentation/controller/signup/signup-controller";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { AccountMysqlRepository } from "../../../infra/database/mysql/account-repository/account-mysql-repository";

export const makeSignupController = (): Controller => {
  const addAccountRepository = new AccountMysqlRepository();
  const addAccount = new DbAddAccount(addAccountRepository);
  return new AccountController(addAccount);
};
