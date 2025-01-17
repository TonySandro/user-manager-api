import jwt from "jsonwebtoken";
import { IVerifyAccessToken } from "./../domain/usecases/verify-access-token";
import env from "../main/config/env";

export class VerifyAccessToken implements IVerifyAccessToken {
  verify(token: string): boolean {
    try {
      if (!token || token.split(" ")[1]) return false;
      jwt.verify(token, env.jwtSecret);

      return true;
    } catch (error) {
      return false;
    }
  }
}
