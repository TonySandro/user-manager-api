import { Repository } from "typeorm";
import { AppDataSource } from "../../../../main/config/typeorm.config";

export const MysqlHelper = {
  async connect() {
    await AppDataSource.initialize();
  },

  async disconnect() {
    if (AppDataSource && AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  },

  async getRepository<T>(entity: new () => T): Promise<Repository<T>> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    return AppDataSource.getRepository(entity);
  },

  async deleteAccountByEmail(email: string): Promise<void> {
    const accountRepository = AppDataSource.getRepository("accounts");
    const account = await accountRepository.findOne({ where: { email } });

    await accountRepository.remove(account);
  },
};
