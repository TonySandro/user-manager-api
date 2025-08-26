import { AppDataSource } from "../../main/config/typeorm.config";

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await AppDataSource.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
};
