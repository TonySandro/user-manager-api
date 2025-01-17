import { AddUser } from "../../../domain/usecases/add-user";
import { MissingParamError } from "../../errors";
import {
  badRequest,
  serverError,
  success,
} from "../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class UserRegistrationController implements Controller {
  constructor(private readonly addUser: AddUser) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new MissingParamError("passwordConfirmation"));
      }

      await this.addUser.add({ name, email, password });

      return success(httpRequest.body);
    } catch (error) {
      return serverError(error);
    }
  }
}
