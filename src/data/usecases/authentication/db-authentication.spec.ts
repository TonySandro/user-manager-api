import { DbAuthentication } from "./db-authentication";
import {
  LoadUserByEmailRepository,
  UpdateAccessTokenRepository,
  Encrypter,
  HashComparer,
  UserModel,
} from "./db-authentication-protocols";

const makeFakeUserModel = (): UserModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "hashed_password",
  accessToken: "any_accessToken",
  urls: [],
  createdAt: undefined,
  updatedAt: undefined,
  deletedAt: undefined,
});

const makeFakeUser = () => ({
  email: "any_email@email.com",
  password: "any_password",
});

const makeLoadUserByEmailRepository = (): LoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements LoadUserByEmailRepository {
    async loadByEmail(email: string): Promise<UserModel> {
      const user: UserModel = makeFakeUserModel();
      return new Promise((resolve) => resolve(user));
    }
  }

  return new LoadUserByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  return new HashComparerStub();
};

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
    }
  }

  return new EncrypterStub();
};
const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new UpdateAccessTokenRepositoryStub();
};

interface SutType {
  sut: DbAuthentication;
  loadUserByEmailRepositoryStub: LoadUserByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutType => {
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const encrypterStub = makeEncrypter();
  const hashComparerStub = makeHashComparer();
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRepository();
  const sut = new DbAuthentication(
    loadUserByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadUserByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  test("Should call LoadUserByEmailRepository with correct email", async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadUserByEmailRepositoryStub, "loadByEmail");
    await sut.auth(makeFakeUser());

    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should throw if LoadUserByEmailRepository throws", async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeUser());

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if LoadUserByEmailRepository returns null", async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadUserByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(null);
    const accessToken = await sut.auth(makeFakeUser());

    expect(accessToken).toBeNull();
  });

  test("Should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const comparerSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(makeFakeUser());

    expect(comparerSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("Should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeUser());

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const accessToken = await sut.auth(makeFakeUser());

    expect(accessToken).toBeNull();
  });

  test("Should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(makeFakeUser());

    expect(encryptSpy).toHaveBeenCalledWith("any_id");
  });

  test("Should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeUser());

    await expect(promise).rejects.toThrow();
  });

  test("Should call Encrypter returns a token on success", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeUser());

    expect(accessToken).toBe("any_token");
  });

  test("Should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );
    await sut.auth(makeFakeUser());

    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  test("Should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeUser());

    await expect(promise).rejects.toThrow();
  });
});
