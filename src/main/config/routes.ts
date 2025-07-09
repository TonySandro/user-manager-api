import { Express, Router } from "express";
import { readdirSync } from "node:fs";
import confirmationRoute from "../routes/email-confirmation";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  app.use("/api", confirmationRoute);

  readdirSync(`${__dirname}/../routes`).map(async (file) => {
    if (!file.includes(".test.")) {
      (await import(`../routes/${file}`)).default(router);
    }
  });
};
