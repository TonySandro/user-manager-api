import {
  AddUrlShortener,
  AddUrlShortenerModel,
  AddUrlShortenerRepository,
  UrlShortenerModel,
} from "./db-add-url-protocols";

export class DbAddUrl implements AddUrlShortener {
  constructor(
    private readonly addUrlShortenerRepository: AddUrlShortenerRepository
  ) {}

  async add(data: AddUrlShortenerModel): Promise<UrlShortenerModel> {
    return await this.addUrlShortenerRepository.add(data);
  }
}
