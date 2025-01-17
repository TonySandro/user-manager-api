import { UserModel } from "../../../domain/models/user";
import { AddUser, AddUserModel } from "../../../domain/usecases/add-user";
import { ServerError, MissingParamError } from "../../errors";
import { serverError, success } from "../../helpers/http/http-helper";
import { UserRegistrationController } from "./user-registration-controller";

const makeHttpRequest = () => ({
  body: {
    name: "any_name",
    email: "any_email",
    password: "any_password",
    passwordConfirmation: "any_password",
  },
});

const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    async add(user: AddUserModel): Promise<UserModel> {
      const FakeUser = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email",
        password: "valid_password",
        passwordConfirmation: "valid_password",
        accessToken: "any_accessToken",
        urls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      return new Promise((resolve) => resolve(FakeUser));
    }
  }

  return new AddUserStub();
};

const makeSut = () => {
  const addUserStub = makeAddUser();
  const sut = new UserRegistrationController(addUserStub);

  return {
    sut,
    addUserStub,
  };
};

describe("User Registration Controller", () => {
  test("Should return 200 if success", async () => {
    const { sut } = makeSut();
    const httpRequest = makeHttpRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(success(httpRequest.body));
  });

  test("Should return 400 if no name is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "any_email",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });

  test("Should return 400 if no email is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });

  test("Should return 400 if no password is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        passwordConfirmation: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });

  test("Should return 400 if no passwordConfirmation is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email",
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });

  test("Should call AddUser with correct values", async () => {
    const { sut, addUserStub } = makeSut();
    const addSpy = jest.spyOn(addUserStub, "add");

    await sut.handle(makeHttpRequest());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });
  });

  test("Should return 500 if AddUser throws", async () => {
    const { sut, addUserStub } = makeSut();
    jest.spyOn(addUserStub, "add").mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse.body).toEqual(new ServerError(null));
  });
});
