import { NodeUrlShortener } from "../../presentation/helpers/shortener/node-url-shortener";
import crypto from "crypto";

export class cryptoAdapter implements NodeUrlShortener {
  async short(originalUrl: string) {
    return crypto.randomBytes(4).toString("hex").slice(0, 6);
  }
}
