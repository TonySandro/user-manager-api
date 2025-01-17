import { Repository } from "typeorm";
import { ListUrl } from "../../../domain/usecases/list-url";
import { UrlShortenerModel } from "../add-url/db-add-url-protocols";
import { ListUrlRepository } from "../../protocols/database/list-url-repository";

export class DbListUrl implements ListUrl {
  constructor(private readonly urlRepository: ListUrlRepository) {}

  async list(id: string): Promise<UrlShortenerModel[]> {
    return await this.urlRepository.listByUserId(
      Object.assign({
        where: {
          user: { id },
        },
      })
    );
  }
}
