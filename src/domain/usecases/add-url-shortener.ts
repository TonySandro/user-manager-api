import { UrlShortenerModel } from "../models/shortener";

export interface AddUrlShortenerModel {
  originalUrl: string;
  shortUrl: string;
  userId?: string;
}

export interface AddUrlShortener {
  add(data: AddUrlShortenerModel): Promise<UrlShortenerModel>;
}
