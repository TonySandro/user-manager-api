import { AppDataSource } from "../../../../main/config/typeorm.config";
import { LogMysqlRepository } from "./log-mysql-repository";
import { ErrorLog } from "../../../../domain/models/error-log";

const makeSut = (): LogMysqlRepository => {
  return new LogMysqlRepository();
};

describe("Log MySQL Repository", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    const errorLogRepository = AppDataSource.getRepository(ErrorLog);
    await errorLogRepository.clear();
  });

  test("Should create an error log on success", async () => {
    const sut = makeSut();
    await sut.logError("any_error");

    const errorLogRepository = AppDataSource.getRepository(ErrorLog);
    const count = await errorLogRepository.count();
    expect(count).toBe(1);

    const logs = await errorLogRepository.find();
    expect(logs[0].stack).toBe("any_error");
    expect(logs[0].date).toBeDefined();
  });
});
