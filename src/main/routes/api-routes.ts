import { Router } from "express";
import { adaptRoute } from "../adapters/express/express-route-adapter";
import { makeUserRegistrationController } from "../factories/user-registration/user-registration-factory";
import { makeLoginController } from "../factories/login/login-factory";
import { makeRedirectController } from "../factories/load-url/load-url-factory";
import { makeUrlShortenerController } from "../factories/url-shortener/url-shortener-factory";
import { makeUserUrlListController } from "../factories/user-url-list/user-url-list-factory";

export default (router: Router): void => {
  router.post("/user", adaptRoute(makeUserRegistrationController()));
  router.post("/url", adaptRoute(makeUrlShortenerController()));
  router.post("/login", adaptRoute(makeLoginController()));

  router.get("/:shortUrl", adaptRoute(makeRedirectController()));
  router.get("/urls", adaptRoute(makeUserUrlListController()));
};
