import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { makeSignupController } from "../factories/signup/signup-factory";
import { makeAccessTokenController } from "../factories/access-token/access-token-factory";
import { makeLoadByEmailController } from "../factories/load-by-email/load-by-email-factory";
import { makeHealthCheckController } from "../factories/health/healthcheck-factory";

export default (router: Router): void => {
  router.post("/create-account", adaptRoute(makeSignupController()));
  router.post("/update-access-token", adaptRoute(makeAccessTokenController()));
  router.get("/get-account-by-email", adaptRoute(makeLoadByEmailController()));
  router.get("/health", adaptRoute(makeHealthCheckController()));
};
