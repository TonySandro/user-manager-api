import { Controller } from "../../../presentation/protocols";
import { UserRegistrationController } from "../../../presentation/controller/user-registration/user-registration-controller";
import { DbAddUser } from "../../../data/usecases/add-user/db-add-user";
import { UserMysqlRepository } from "../../../infra/database/mysql/user-repository/user-mysql-repository";
import { BcryptAdapter } from "../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter";

export const makeUserRegistrationController = (): Controller => {
  const addUserRepository = new UserMysqlRepository();
  const bcryptAdapter = new BcryptAdapter(12);
  const addUser = new DbAddUser(bcryptAdapter, addUserRepository);
  const userController = new UserRegistrationController(addUser);

  return userController;
};
