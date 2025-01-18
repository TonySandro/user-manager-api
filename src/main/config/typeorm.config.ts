import { DataSource } from "typeorm";
import { AccountModel } from "../../domain/models/account";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3307,
  username: "root",
  password: "admintsd",
  database: "course-platform",
  synchronize: true,
  logging: false,
  entities: [AccountModel],
});
