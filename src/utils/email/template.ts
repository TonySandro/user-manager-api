export class EmailTemplates {
  static verificationEmail(
    name: string,
    token: string
  ): { subject: string; html: string } {
    const link = `https://neuropp.com/signup/confirm?token=${token}`;
    return {
      subject: "Confirmação de Cadastro – NeuroPPAvalia",
      html: `
        <p>Olá <strong>${name}</strong>,</p>
        <p>Obrigado por se cadastrar na NeuroPPAvalia.</p>
        <p>Para ativar sua conta, clique no link abaixo:</p>
        <a href="${link}" target="_blank">${link}</a>
        <p>Se você não se cadastrou, apenas ignore este e-mail.</p>
      `,
    };
  }
}
