import { success } from "../../helpers/http/http-helper";
import { Controller, HttpResponse } from "../../protocols";
import { serverError } from "../../helpers/http/http-helper";
import { GetAllAccountsRepository } from "../../../data/protocols/database/get-all-accounts-repository";

export class GetAllAccountsController implements Controller {
  constructor(private readonly getAllAccounts: GetAllAccountsRepository) {}

  async handle(): Promise<HttpResponse> {
    try {
      return success(await this.getAllAccounts.getAllAccounts());
    } catch (error) {
      return serverError(error);
    }
  }
}
