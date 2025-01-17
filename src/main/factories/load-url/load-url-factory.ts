import { DbLoadUrlByShort } from "../../../infra/database/mysql/load-url/db-load-url";
import { UrlShortenerMysqlRepository } from "../../../infra/database/mysql/url-shortener-repository/url-shortener-mysql-repository";
import { RedirectController } from "../../../presentation/controller/redirect/redirect-controller";
import {
  Controller,
  LogControllerDecorator,
  LogMysqlRepository,
} from "../login/login-factory-protocols";

export const makeRedirectController = (): Controller => {
  const urlShortenerRepository = new UrlShortenerMysqlRepository();
  const loadUrlByShort = new DbLoadUrlByShort(urlShortenerRepository);
  const redirectController = new RedirectController(loadUrlByShort);

  const logMysqlRepository = new LogMysqlRepository();
  return new LogControllerDecorator(redirectController, logMysqlRepository);
};
