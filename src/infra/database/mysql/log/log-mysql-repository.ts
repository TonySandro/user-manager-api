import { LogErrorRepository } from "../../../../data/protocols/database/log-error-repository";
import { ErrorLog } from "../../../../domain/models/error-log";
import { AppDataSource } from "../../../../main/config/typeorm.config";

export class LogMysqlRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorLogRepository = AppDataSource.getRepository(ErrorLog);

    await errorLogRepository.save({
      stack,
      date: new Date(),
    });
  }
}
