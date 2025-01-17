import { AppDataSource } from "./../../../../main/config/typeorm.config";
import { LoadUrlByShortRepository } from "../../protocols/database/load-url-by-short-repository";
import { UrlShortenerModel } from "../../../../domain/models/shortener";
import { AddUrlShortenerModel } from "../../../../domain/usecases/add-url-shortener";
import { AddUrlShortenerRepository } from "../../../../data/protocols/database/add-url-shortener-repository";

export class UrlShortenerMysqlRepository
  implements LoadUrlByShortRepository, AddUrlShortenerRepository
{
  async add(data: AddUrlShortenerModel): Promise<UrlShortenerModel> {
    const userRepository = AppDataSource.getRepository(UrlShortenerModel);
    const newUser = userRepository.create(data);

    return await userRepository.save(newUser);
  }

  async loadByShort(shortUrl: string): Promise<{ originalUrl: string } | null> {
    const repository = AppDataSource.getRepository(UrlShortenerModel);
    const urlData = await repository.findOne({ where: { shortUrl } });

    if (!urlData) return null;

    return { originalUrl: urlData.originalUrl };
  }

  async incrementClicks(shortUrl: string): Promise<void> {
    const repository = AppDataSource.getRepository(UrlShortenerModel);
    await repository.increment({ shortUrl }, "clickCount", 1);
  }

  async listByUserId(userId: string): Promise<UrlShortenerModel[]> {
    const repository = AppDataSource.getRepository(UrlShortenerModel);

    return await repository.find({
      where: { user: { id: userId } },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });
  }
}
