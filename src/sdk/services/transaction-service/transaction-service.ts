
import { Transaction } from "../../proxies/transaction/transaction";

export interface TransactionService
{
    getTransactions(): Promise<ReadonlyArray<Transaction>>;
    getTransaction(id: string): Promise<Transaction>;
    createTransaction(name: string, description: string, transactionType: string, transactionCurrency: string, amount: number): Promise<Transaction>;
}




