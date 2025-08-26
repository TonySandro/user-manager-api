import { AccountModel } from "../../../domain/models/account";

export interface GetAllAccountsRepository {
  getAllAccounts(): Promise<AccountModel[]>;
}
