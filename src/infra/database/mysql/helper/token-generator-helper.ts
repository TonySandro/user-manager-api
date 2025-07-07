import { randomBytes } from "crypto";
import { addHours } from "date-fns";

export interface EmailTokenResult {
  token: string;
  expiresAt: Date;
}

interface GenerateEmailTokenOptions {
  size?: number;
  expiresInHours?: number;
  prefix?: string;
}

export class EmailTokenGenerator {
  static generate(options?: GenerateEmailTokenOptions): EmailTokenResult {
    const size = options?.size ?? 32;
    const expiresIn = options?.expiresInHours ?? 24;
    const prefix = options?.prefix ? `${options.prefix}-` : "";

    const token = prefix + randomBytes(size).toString("hex");
    const expiresAt = addHours(new Date(), expiresIn);

    return { token, expiresAt };
  }
}
