import env from "../../config/env";
import { makeLoginValidation } from "./login-validation-factory";
import {
  AccountMysqlRepository,
  BcryptAdapter,
  Controller,
  DbAuthentication,
  JwtAdapter,
  LoginController,
} from "./login-factory-protocols";

export const makeLoginController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMysqlRepository = new AccountMysqlRepository();
  const dbAuthentication = new DbAuthentication(
    accountMysqlRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMysqlRepository
  );

  return new LoginController(dbAuthentication, makeLoginValidation());
};
