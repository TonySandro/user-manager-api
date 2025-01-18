import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { makeUserRegistrationController } from "../factories/user-registration/user-registration-factory";
import { makeLoginController } from "../factories/login/login-factory";

export default (router: Router): void => {
  router.post("/user", adaptRoute(makeUserRegistrationController()));
  router.post("/login", adaptRoute(makeLoginController()));
};
