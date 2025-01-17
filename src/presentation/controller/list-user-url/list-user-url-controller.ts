import { ListUrl } from "../../../domain/usecases/list-url";
import { IVerifyAccessToken } from "../../../domain/usecases/verify-access-token";
import { MissingParamError } from "../../errors";
import {
  badRequest,
  success,
  unauthorized,
} from "../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class ListUserUrlController implements Controller {
  constructor(
    private readonly listUrl: ListUrl,
    private readonly verifyAccessToken: IVerifyAccessToken
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!this.verifyAccessToken.verify(httpRequest.headers["Authorization"]))
      return unauthorized();

    if (!httpRequest.body.id) return badRequest(new MissingParamError("id"));
    const allUserUrls = await this.listUrl.list(httpRequest.body.id);

    return success(allUserUrls);
  }
}
