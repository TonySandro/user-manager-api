import { DbAuthentication } from "./db-authentication";
import {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
  Encrypter,
  HashComparer,
  AccountModel,
} from "./db-authentication-protocols";

const makeFakeAccountModel = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@email.com",
  password: "hashed_password",
  accessToken: "any_accessToken",
  isConfirmed: false,
  emailConfirmationToken: "any_emailConfirmationToken",
  emailConfirmationExpiresAt: new Date(),
  createdAt: undefined,
  updatedAt: undefined,
  deletedAt: undefined,
});

const makeFakeAccount = () => ({
  email: "any_email@email.com",
  password: "any_password",
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadByEmail(email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccountModel();
      return new Promise((resolve) => resolve(account));
    }
  }

  return new LoadAccountByEmailRepositoryStub();
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
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutType => {
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const encrypterStub = makeEncrypter();
  const hashComparerStub = makeHashComparer();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");
    await sut.auth(makeFakeAccount());

    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should throw if LoadAccountByEmailRepository throws", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAccount());

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if LoadAccountByEmailRepository returns null", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadByEmail")
      .mockReturnValueOnce(null);
    const accessToken = await sut.auth(makeFakeAccount());

    expect(accessToken).toBeNull();
  });

  test("Should call HashComparer with correct values", async () => {
    const { sut, hashComparerStub } = makeSut();
    const comparerSpy = jest.spyOn(hashComparerStub, "compare");
    await sut.auth(makeFakeAccount());

    expect(comparerSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("Should throw if HashComparer throws", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAccount());

    await expect(promise).rejects.toThrow();
  });

  test("Should return null if HashComparer returns false", async () => {
    const { sut, hashComparerStub } = makeSut();
    jest
      .spyOn(hashComparerStub, "compare")
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const accessToken = await sut.auth(makeFakeAccount());

    expect(accessToken).toBeNull();
  });

  test("Should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(makeFakeAccount());

    expect(encryptSpy).toHaveBeenCalledWith("any_id");
  });

  test("Should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAccount());

    await expect(promise).rejects.toThrow();
  });

  test("Should call Encrypter returns a token on success", async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAccount());

    expect(accessToken).toBe("any_token");
  });

  test("Should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );
    await sut.auth(makeFakeAccount());

    expect(updateSpy).toHaveBeenCalledWith("any_id", "any_token");
  });

  test("Should throw if UpdateAccessTokenRepository throws", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAccount());

    await expect(promise).rejects.toThrow();
  });
});
