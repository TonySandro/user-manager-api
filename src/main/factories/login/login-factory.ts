import env from "../../config/env";
import { makeLoginValidation } from "./login-validation-factory";
import {
  UserMysqlRepository,
  BcryptAdapter,
  Controller,
  DbAuthentication,
  JwtAdapter,
  LogControllerDecorator,
  LoginController,
  LogMysqlRepository,
} from "./login-factory-protocols";

export const makeLoginController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const userMysqlRepository = new UserMysqlRepository();
  const dbAuthentication = new DbAuthentication(
    userMysqlRepository,
    bcryptAdapter,
    jwtAdapter,
    userMysqlRepository
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  );

  const logMysqlRepository = new LogMysqlRepository();
  return new LogControllerDecorator(loginController, logMysqlRepository);
};
