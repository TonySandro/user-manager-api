import { ResendMailerService } from "../../../infra/mailer/resend-mailer";
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  AddAccountRepository,
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAccount {
  constructor(private readonly addAccountRepository: AddAccountRepository) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountRepo = await this.addAccountRepository.add(account);

    const resend = new ResendMailerService();
    await resend.sendVerificationEmail(
      accountRepo.email,
      accountRepo.name,
      accountRepo.emailConfirmationToken
    );

    return accountRepo;
  }
}
