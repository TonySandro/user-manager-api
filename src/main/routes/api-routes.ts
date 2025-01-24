import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { makeAccountController } from "../factories/signup/signup-factory";
import { makeLoginController } from "../factories/login/login-factory";

export default (router: Router): void => {
  router.post("/create-account", adaptRoute(makeAccountController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
