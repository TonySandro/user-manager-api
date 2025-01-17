import { UrlShortenerModel } from "../models/shortener";

export interface ListUrl {
  list(userId: string): Promise<UrlShortenerModel[]>;
}
