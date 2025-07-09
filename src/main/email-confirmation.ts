import { Request, Response, Router } from "express";
import { AppDataSource } from "./config/typeorm.config";
import { AccountModel } from "../domain/models/account";

const confirmationRoute = Router();

confirmationRoute.get(
  "/confirm-email",
  async (req: Request, res: Response): Promise<any> => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).send("Token inválido");
    }

    try {
      const accountRepository = AppDataSource.getRepository(AccountModel);

      const account = await accountRepository.findOne({
        where: { emailConfirmationToken: token },
      });

      if (!account) {
        return res.status(404).send("Conta não encontrada");
      }

      if (
        !account.emailConfirmationExpiresAt ||
        account.emailConfirmationExpiresAt < new Date()
      ) {
        return res.status(400).send("Token expirado");
      }

      account.isConfirmed = true;
      account.emailConfirmationToken = null;
      account.emailConfirmationExpiresAt = null;

      await accountRepository.save(account);

      return res.send("E-mail confirmado com sucesso!");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro ao confirmar o e-mail");
    }
  }
);

export default confirmationRoute;
