import { UrlShortenerModel } from "../../../../domain/models/shortener";
import { ListUrl } from "../../../../domain/usecases/list-url";
import { LoadUrlByShort } from "../../../../domain/usecases/load-url-by-short";
import { LoadUrlByShortRepository } from "../../protocols/database/load-url-by-short-repository";

export class DbLoadUrlByShort implements LoadUrlByShort, ListUrl {
  constructor(
    private readonly loadUrlByShortRepository: LoadUrlByShortRepository
  ) {}

  async load(shortUrl: string): Promise<{ originalUrl: string } | null> {
    const urlData = await this.loadUrlByShortRepository.loadByShort(shortUrl);
    if (!urlData) return null;

    await this.loadUrlByShortRepository.incrementClicks(shortUrl);

    return { originalUrl: urlData.originalUrl };
  }

  async list(userId: string): Promise<UrlShortenerModel[]> {
    const urls = await this.loadUrlByShortRepository.listByUserId(userId);
    return urls;
  }
}
