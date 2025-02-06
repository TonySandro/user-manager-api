import { LoadByEmailController } from "../../../presentation/controller/load-by-email/load-by-email-controller";
import {
  AccountMysqlRepository,
  Controller,
} from "../login/login-factory-protocols";

export const makeLoadByEmailController = (): Controller => {
  const accountMysqlRepository = new AccountMysqlRepository();
  return new LoadByEmailController(accountMysqlRepository);
};
