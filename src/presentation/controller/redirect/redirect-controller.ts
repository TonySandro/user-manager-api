import { MissingParamError } from "../../errors";
import { badRequest, redirect, success } from "../../helpers/http/http-helper";
import { Controller, HttpResponse } from "../../protocols";
import { LoadUrlByShort } from "../../../domain/usecases/load-url-by-short";
import { Request } from "express";

export class RedirectController implements Controller {
  constructor(private readonly loadUrlByShort: LoadUrlByShort) {}

  async handle(httpRequest: Request): Promise<HttpResponse> {
    const shortUrl = httpRequest.params.shortUrl;

    if (!shortUrl) return badRequest(new MissingParamError("shortUrl"));

    const urlData = await this.loadUrlByShort.load(shortUrl);

    if (!urlData) return badRequest(new MissingParamError("URL not found"));
    return success(redirect(urlData.originalUrl));
  }
}
