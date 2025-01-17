import { UrlShortenerModel } from "../../../domain/models/shortener";
import { UserModel } from "../../../domain/models/user";
import { ListUrl } from "../../../domain/usecases/list-url";
import { IVerifyAccessToken } from "../../../domain/usecases/verify-access-token";
import { MissingParamError } from "../../errors";
import { success } from "../../helpers/http/http-helper";
import { ListUserUrlController } from "./list-user-url-controller";

const makeListUrl = (): ListUrl => {
  class ListUrlStub implements ListUrl {
    async list(id: string): Promise<UrlShortenerModel[]> {
      const FakeUrl: UrlShortenerModel = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        originalUrl: "https://example.com",
        shortUrl: "abc123",
        user: {
          id: "456e7890-e12d-34f5-b678-426614174111",
          name: "Tony S.",
          email: "tony.s@example.com",
          password: "hashed_password",
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        } as UserModel,
        clickCount: 10,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-02T00:00:00Z"),
        deletedAt: null,
      };

      return new Promise((resolve) => resolve([FakeUrl]));
    }
  }

  return new ListUrlStub();
};

const makeVerifyAccessToken = () => {
  class VerifyAccessTokenStub implements IVerifyAccessToken {
    verify(token: string): boolean {
      return true;
    }
  }

  return new VerifyAccessTokenStub();
};

const makeHttpRequest = () => ({
  headers: ["Authorization"],
  body: { id: "valid_id" },
});

const makeSut = () => {
  const verifyAccessTokenStub = makeVerifyAccessToken();
  const listUrlStub = makeListUrl();
  const sut = new ListUserUrlController(listUrlStub, verifyAccessTokenStub);

  return {
    sut,
    listUrlStub,
    verifyAccessTokenStub,
  };
};

describe("List User Urls Controller", () => {
  test("Should return 400 if no user id is provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      headers: ["Authorization"],
      body: {},
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.body).toEqual(new MissingParamError("id"));
  });

  test("Should call ListUrl with correct values", async () => {
    const { sut, listUrlStub } = makeSut();
    const addSpy = jest.spyOn(listUrlStub, "list");

    await sut.handle(makeHttpRequest());
    expect(addSpy).toHaveBeenCalledWith(makeHttpRequest().body.id);
  });

  test("Should return 200 if success", async () => {
    const { sut, listUrlStub } = makeSut();
    const urls = await listUrlStub.list("valid_id");

    const httpResponse = await sut.handle(makeHttpRequest());
    expect(httpResponse).toEqual(success(urls));
  });
});
