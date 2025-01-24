import { DataSource } from "typeorm";
import { AccountModel } from "../../domain/models/account";
import { env } from "process";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "mysql",
  port: Number(env.MYSQLDB_LOCAL_PORT),
  username: env.MYSQLDB_USER,
  password: env.MYSQLDB_ROOT_PASSWORD,
  database: env.MYSQLDB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [AccountModel],
});
