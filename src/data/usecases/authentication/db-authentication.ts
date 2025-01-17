import {
  LoadUserByEmailRepository,
  UpdateAccessTokenRepository,
  Encrypter,
  HashComparer,
  Authentication,
  authenticationModel,
} from "./db-authentication-protocols";

export class DbAuthentication implements Authentication {
  constructor(
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authentication: authenticationModel): Promise<string> {
    const user = await this.loadUserByEmailRepository.loadByEmail(
      authentication.email
    );

    if (user) {
      const isValid = await this.hashComparer.compare(
        authentication.password,
        user.password
      );

      if (isValid) {
        const accessToken = await this.encrypter.encrypt(user.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          user.id,
          accessToken
        );
        return accessToken;
      }
    }

    return null;
  }
}
