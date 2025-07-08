export interface MailerService {
  sendVerificationEmail(to: string, name: string, token: string): Promise<void>;
}
