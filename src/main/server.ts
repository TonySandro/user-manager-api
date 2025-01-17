import env from "./config/env";
import { AppDataSource } from "./config/typeorm.config";

AppDataSource.initialize()
  .then(async () => {
    const app = (await import("./config/app")).default;
    app.listen(env.port, () =>
      console.log(`server running at http://localhost:${env.port}`)
    );
  })
  .catch(console.error);
