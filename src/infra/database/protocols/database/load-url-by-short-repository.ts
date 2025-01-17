import { UrlShortenerModel } from "../../../../domain/models/shortener";

export interface LoadUrlByShortRepository {
  loadByShort(shortUrl: string): Promise<{ originalUrl: string } | null>;
  incrementClicks(shortUrl: string): Promise<void>;
  listByUserId(userId: string): Promise<UrlShortenerModel[]>;
}
