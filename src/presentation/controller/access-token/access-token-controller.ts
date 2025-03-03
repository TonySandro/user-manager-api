import { UpdateAccessTokenRepository } from "../../../data/protocols/database";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { serverError, success } from "../../helpers/http/http-helper";

export class AccessTokenController implements Controller {
  constructor(
    private readonly updateAccessToken: UpdateAccessTokenRepository
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id, accessToken } = httpRequest.body;
      await this.updateAccessToken.updateAccessToken(id, accessToken);
      return success("Update access token success.");
    } catch (error) {
      return serverError(error);
    }
  }
}
