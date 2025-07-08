import { AccountMysqlRepository } from "./account-mysql-repository";
import { MysqlHelper } from "../helper/mysql-helper";

const makeSut = () => {
  return new AccountMysqlRepository();
};

describe("Account Mysql repository", () => {
  beforeAll(async () => {
    await MysqlHelper.connect();
  });

  afterAll(async () => {
    await MysqlHelper.disconnect();
  });

  afterEach(async () => {
    await MysqlHelper.deleteAccountByEmail("any_email@email.com");
  });

  test("Should return account if success", async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: "any_name",
      email: "any_email@email.com",
      password: "any_password",
      emailConfirmationToken: "any_emailConfirmationToken",
    });

    expect(account).toBeTruthy();
    expect(account.name).toBe("any_name");
    expect(account.email).toBe("any_email@email.com");
    expect(account.emailConfirmationToken).toBe("any_emailConfirmationToken");
    expect(account.password).toBeDefined();
  });
});
