import { AddUrlShortener } from "../../../domain/usecases/add-url-shortener";
import env from "../../../main/config/env";
import { MissingParamError } from "../../errors";
import { badRequest, success } from "../../helpers/http/http-helper";
import { NodeUrlShortener } from "../../helpers/shortener/node-url-shortener";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class UrlShortenerController implements Controller {
  constructor(
    private readonly addUrlShortener: AddUrlShortener,
    private readonly nodeUrlShortener: NodeUrlShortener
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { originalUrl } = httpRequest.body;
    if (!originalUrl) return badRequest(new MissingParamError("originalUrl"));

    const shortUrl = await this.nodeUrlShortener.short(originalUrl);
    const savedUrl = {
      originalUrl,
      shortUrl,
    };

    const newUrl = await this.addUrlShortener.add(savedUrl);
    return success({ data: newUrl, newUrl: `${env.baseUrl}/${shortUrl}` });
  }
}
