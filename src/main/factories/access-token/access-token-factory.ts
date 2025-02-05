import { AccessTokenController } from "../../../presentation/controller/access-token/access-token-controller";
import {
  AccountMysqlRepository,
  Controller,
} from "../login/login-factory-protocols";

export const makeAccessTokenController = (): Controller => {
  const accountMysqlRepository = new AccountMysqlRepository();
  return new AccessTokenController(accountMysqlRepository);
};
