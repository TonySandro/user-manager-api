import { UserModel } from "../add-user/db-add-user-protocols";
import { DbAddUrl } from "./db-add-url";
import {
  AddUrlShortener,
  AddUrlShortenerModel,
  AddUrlShortenerRepository,
  UrlShortenerModel,
} from "./db-add-url-protocols";

const makeAddUrlShortenerRepository = (): AddUrlShortenerRepository => {
  class AddUrlShortenerRepositoryStub implements AddUrlShortenerRepository {
    async add(data: AddUrlShortenerModel): Promise<UrlShortenerModel> {
      return new Promise((resolve) => resolve(makeFakeUrlShortener()));
    }
  }
  return new AddUrlShortenerRepositoryStub();
};

const makeFakeUrlShortener = (): UrlShortenerModel => ({
  id: "valid_id",
  originalUrl: "any_originalUrl",
  shortUrl: "anyUrl",
  clickCount: 0,
  createdAt: new Date("2024-12-02 12:30:45"),
  updatedAt: new Date("2024-12-02 12:30:45"),
  deletedAt: null,
  user: new UserModel(),
});

const makeFakeUrlShortenerData = (): AddUrlShortenerModel => ({
  originalUrl: "any_originalUrl",
  shortUrl: "anyUrl",
  userId: "any_userId",
});

interface SutTypes {
  sut: DbAddUrl;
  addUrlRepositoryStub: AddUrlShortenerRepository;
}

const makeSut = (): SutTypes => {
  const addUrlRepositoryStub = makeAddUrlShortenerRepository();
  const sut = new DbAddUrl(addUrlRepositoryStub);

  return {
    sut,
    addUrlRepositoryStub,
  };
};

describe("DB AddUrl Usecase", () => {
  test("Should call AddUrlShortenerRepository with correct values", async () => {
    const { sut, addUrlRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addUrlRepositoryStub, "add");

    await sut.add(makeFakeUrlShortenerData());
    expect(addSpy).toHaveBeenCalledWith({
      originalUrl: "any_originalUrl",
      shortUrl: "anyUrl",
      userId: "any_userId",
    });
  });

  test("Should throw addUrlShortenerRepository with correct throws", async () => {
    const { sut, addUrlRepositoryStub } = makeSut();
    jest
      .spyOn(addUrlRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const promise = sut.add(makeFakeUrlShortenerData());
    await expect(promise).rejects.toThrow();
  });

  test("Should return an url on success", async () => {
    const { sut } = makeSut();

    const user = await sut.add(makeFakeUrlShortenerData());
    expect(user).toEqual(makeFakeUrlShortener());
  });
});
