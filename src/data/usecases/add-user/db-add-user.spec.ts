import {
  UserModel,
  AddUserModel,
  AddUserRepository,
} from "./db-add-user-protocols";
import { DbAddUser } from "./db-add-user";
import { Hasher } from "../../protocols/cryptography/hasher";

const makeAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    async add(user: AddUserModel): Promise<UserModel> {
      return new Promise((resolve) => resolve(makeFakeUser()));
    }
  }
  return new AddUserRepositoryStub();
};

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new HasherStub();
};

const makeFakeUser = (): UserModel => ({
  id: "valid_id",
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
  accessToken: "any_accessToken",
  urls: [],
  createdAt: undefined,
  updatedAt: undefined,
  deletedAt: undefined,
});

const makeFakeUserData = (): AddUserModel => ({
  name: "valid_name",
  email: "valid_email",
  password: "valid_password",
});

interface SutTypes {
  sut: DbAddUser;
  addUserRepositoryStub: AddUserRepository;
  hasherStub: Hasher;
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addUserRepositoryStub = makeAddUserRepository();
  const sut = new DbAddUser(hasherStub, addUserRepositoryStub);

  return {
    sut,
    addUserRepositoryStub,
    hasherStub,
  };
};

describe("DB AddUser Usecase", () => {
  test("Should call Hasher with correct password", async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, "hash");

    await sut.add(makeFakeUserData());
    expect(hashSpy).toHaveBeenCalledWith("valid_password");
  });

  test("Should throw Hasher with correct throws", async () => {
    const { sut, hasherStub } = makeSut();
    jest
      .spyOn(hasherStub, "hash")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.add(makeFakeUserData());
    await expect(promise).rejects.toThrow();
  });

  test("Should call AddUserRepository with correct values", async () => {
    const { sut, addUserRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addUserRepositoryStub, "add");

    await sut.add(makeFakeUserData());
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password",
    });
  });

  test("Should throw addUserRepository with correct throws", async () => {
    const { sut, addUserRepositoryStub } = makeSut();
    jest
      .spyOn(addUserRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.add(makeFakeUserData());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an user on success", async () => {
    const { sut } = makeSut();

    const user = await sut.add(makeFakeUserData());
    expect(user).toEqual(makeFakeUser());
  });
});
