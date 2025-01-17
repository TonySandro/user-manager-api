import { UrlShortenerModel } from "../../../domain/models/shortener";
import { AddUrlShortenerModel } from "../../../domain/usecases/add-url-shortener";

export interface AddUrlShortenerRepository {
  add(data: AddUrlShortenerModel): Promise<UrlShortenerModel>;
}
