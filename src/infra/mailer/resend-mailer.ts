import { EmailTemplates } from "../../utils/email/template";
import { MailerService } from "../../domain/models/mailer-service";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendMailerService implements MailerService {
  private fromEmail = "noreply@avaliapsico.com";

  async sendVerificationEmail(
    to: string,
    name: string,
    token: string
  ): Promise<void> {
    const { subject, html } = EmailTemplates.verificationEmail(name, token);

    await resend.emails.send({
      from: this.fromEmail,
      to,
      subject,
      html,
    });
  }
}
