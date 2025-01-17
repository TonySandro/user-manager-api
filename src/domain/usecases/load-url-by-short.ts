export interface LoadUrlByShort {
  load(shortUrl: string): Promise<{ originalUrl: string } | null>;
}
