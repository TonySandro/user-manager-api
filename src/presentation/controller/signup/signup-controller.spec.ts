import { AccountModel } from "../../../domain/models/account";
import {
  AddAccount,
  AddAccountModel,
} from "../../../domain/usecases/add-account";
import { ServerError } from "../../errors";
import { success } from "../../helpers/http/http-helper";
import { AccountController } from "./signup-controller";

const makeHttpRequest = () => ({
  body: {
    name: "any_name",
    email: "any_email",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const FakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "valid_password",
        passwordConfirmation: "valid_password",
        accessToken: "any_accessToken",
        isConfirmed: false,
        emailConfirmationToken: null,
        emailConfirmationExpiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      return new Promise((resolve) => resolve(FakeAccount));
    }
  }

  return new AddAccountStub();
};

const makeSut = () => {
  const addAccountStub = makeAddAccount();
  const sut = new AccountController(addAccountStub);

  return {
    sut,
    addAccountStub,
  };
};

describe("Account Registration Controller", () => {
  test("Should return 200 if success", async () => {
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(success(httpRequest.body));
  });

  test("Should call AddAccount with correct values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");

    await sut.handle(makeHttpRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });
  });

  test("Should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse.body).toEqual(new ServerError(null));
  });
});
