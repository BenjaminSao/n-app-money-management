import { Transaction } from "../../proxies/transaction/transaction";


export interface CurrencyConversionService
{
    // fetchInrValue(transactions: Array<Transaction>, transactionCurrency: string, transactionType: string): Promise<number>
    // fetchCadValue(transactions: Array<Transaction>, transactionCurrency: string, transactionType: string): Promise<number>
    // fetchThbValue(transactions: Array<Transaction>, transactionCurrency: string, transactionType: string): Promise<number>

    fetchCadValue(transaction: Transaction): Promise<number>;
    fetchInrValue(transaction: Transaction): Promise<number>;
    fetchThbValue(transaction: Transaction): Promise<number>;
}
