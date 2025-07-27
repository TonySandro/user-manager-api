import { checkDatabaseConnection } from "../../../utils/health/check-database";
import { HealthCheckController } from "../../../presentation/controller/health/healthcheck-controller";
import { Controller } from "../login/login-factory-protocols";

export const makeHealthCheckController = (): Controller => {
  return new HealthCheckController(checkDatabaseConnection);
};
