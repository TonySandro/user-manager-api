import { AddAccount } from "../../../domain/usecases/add-account";
import { serverError, success } from "../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class AccountController implements Controller {
  constructor(private readonly addAccount: AddAccount) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = httpRequest.body;
      await this.addAccount.add({ name, email, password });

      return success(httpRequest.body);
    } catch (error) {
      return serverError(error);
    }
  }
}
