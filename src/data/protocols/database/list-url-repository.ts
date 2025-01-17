import { ListUrl } from "../../../domain/usecases/list-url";
import { UrlShortenerModel } from "../../usecases/add-url/db-add-url-protocols";

export interface ListUrlRepository {
  listByUserId(id: string): Promise<UrlShortenerModel[]>;
}
