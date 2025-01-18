import { Controller } from "../../../presentation/protocols";
import { AccountController } from "../../../presentation/controller/account/account-controller";
import { DbAddAccount } from "../../../data/usecases/add-account/db-add-account";
import { AccountMysqlRepository } from "../../../infra/database/mysql/account-repository/account-mysql-repository";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";

export const makeAccountController = (): Controller => {
  const addAccountRepository = new AccountMysqlRepository();
  const bcryptAdapter = new BcryptAdapter(12);
  const addAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);
  const accountController = new AccountController(addAccount);

  return accountController;
};
