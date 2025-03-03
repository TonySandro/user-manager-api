import { Authentication } from "../../../domain/usecases/authentication";
import {
  serverError,
  unauthorized,
  success,
} from "../../helpers/http/http-helper";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "./login-controller-protocols";

export class LoginController implements Controller {
  constructor(private readonly authentication: Authentication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;
      const accessToken = await this.authentication.auth({ email, password });
      if (!accessToken) {
        return unauthorized();
      }

      return success({ accessToken });
    } catch (error) {
      return serverError(error);
    }
  }
}
