import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { makeSignupController } from "../factories/signup/signup-factory";
import { makeAccessTokenController } from "../factories/access-token/access-token-factory";

export default (router: Router): void => {
  router.post("/create-account", adaptRoute(makeSignupController()));
  router.post("/update-access-token", adaptRoute(makeAccessTokenController()));
};
