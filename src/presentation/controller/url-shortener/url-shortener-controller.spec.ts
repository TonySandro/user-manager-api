import { UrlShortenerModel } from "../../../domain/models/shortener";
import {
  AddUrlShortener,
  AddUrlShortenerModel,
} from "../../../domain/usecases/add-url-shortener";
import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http/http-helper";
import { NodeUrlShortener } from "../../helpers/shortener/node-url-shortener";
import { HttpRequest } from "../../protocols";
import { UrlShortenerController } from "./url-shortener-controller";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    originalUrl: "https://teddydigital.io/sobre/",
  },
});

const makeAddUrl = (): AddUrlShortener => {
  class AddUrlStub implements AddUrlShortener {
    async add(data: AddUrlShortenerModel): Promise<UrlShortenerModel> {
      const FakeUser = {
        id: "valid_id",
        originalUrl: "any_originalUrl",
        shortUrl: "anyUrl",
        clickCount: 0,
        createdAt: new Date("2024-12-02 12:30:45"),
        updatedAt: new Date("2024-12-02 12:30:45"),
        deletedAt: null,
        user: null,
      };

      return new Promise((resolve) => resolve(FakeUser));
    }
  }

  return new AddUrlStub();
};

const makeNodeUrlShortener = (): NodeUrlShortener => {
  class NodeUrlShortenerStub implements NodeUrlShortener {
    short(originalUrl: string) {
      return {
        originalUrl: "https://teddydigital.io/sobre/",
        shortUrl: "http://localhost/aZbKq7",
      };
    }
  }

  return new NodeUrlShortenerStub();
};

const makeSut = () => {
  const addUrlStub = makeAddUrl();
  const nodeUrlShortenerStub = makeNodeUrlShortener();
  const sut = new UrlShortenerController(addUrlStub, nodeUrlShortenerStub);

  return {
    sut,
    nodeUrlShortenerStub,
  };
};

describe("Url Shortener Controller", () => {
  test("Should return 400 if no originalUrl is provided ", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ body: {} });

    expect(httpResponse.body).toEqual(new MissingParamError("originalUrl"));
  });
});
