import { success } from "./../../helpers/http/http-helper";
import { LoadAccountByEmailRepository } from "../../../data/protocols/database";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { serverError } from "../../helpers/http/http-helper";

export class LoadByEmailController implements Controller {
  constructor(
    private readonly loadAccountByEmail: LoadAccountByEmailRepository
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      return success(
        await this.loadAccountByEmail.loadByEmail(httpRequest.body.email)
      );
    } catch (error) {
      return serverError(error);
    }
  }
}
