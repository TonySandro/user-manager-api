import { serviceUnavailable, success } from "../../helpers/http/http-helper";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export class HealthCheckController implements Controller {
  constructor(private readonly checkDatabase: () => Promise<boolean>) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    const dbIsOnline = await this.checkDatabase();

    if (!dbIsOnline) {
      return serviceUnavailable({ error: "Database connection failed" });
    }

    return success({
      status: "success",
      dependency: "database",
      timestamp: new Date(),
      uptime: process.uptime(),
    });
  }
}
