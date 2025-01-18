import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { makeAccountController } from "../factories/account/account-factory";
import { makeLoginController } from "../factories/login/login-factory";

export default (router: Router): void => {
  router.post("/account", adaptRoute(makeAccountController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
