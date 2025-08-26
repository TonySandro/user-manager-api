import { GetAllAccountsController } from "../../../presentation/controller/get-all-accounts/get-all-accounts-controller";
import {
  AccountMysqlRepository,
  Controller,
} from "../login/login-factory-protocols";

export const makeGetAllAccountsController = (): Controller => {
  const accountMysqlRepository = new AccountMysqlRepository();
  return new GetAllAccountsController(accountMysqlRepository);
};
