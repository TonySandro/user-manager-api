import env from "./config/env";
import { AppDataSource } from "./config/typeorm.config";

AppDataSource.initialize()
  .then(async () => {
    const app = (await import("./config/app")).default;
    app.listen(Number(env.port), "0.0.0.0", () => {
      console.log(`Server running on port ${env.port}`);
    });
  })
  .catch(console.error);
