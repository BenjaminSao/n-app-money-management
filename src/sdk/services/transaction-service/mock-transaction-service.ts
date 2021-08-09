
import { TransactionService } from "./transaction-service";
import { MockTransactionProxy } from "../../proxies/transaction/mock-transaction-proxy";
import { Transaction } from "../../proxies/transaction/transaction";
import { given } from "@nivinjoseph/n-defensive";


export class MockTransactionService implements TransactionService
{
    private readonly _transactions: Array<Transaction>;
    private _counter: number;


    public constructor()
    {
        const transactions = new Array<MockTransactionProxy>();
        const count = 0;

        // for (let i = 0; i < count; i++)
        //     transactions.push(new MockTransactionProxy("id", "name", "description", "transactionType", "transactionCurrency", 0));

        this._transactions = transactions;
        this._counter = count;
    }


    public getTransactions(): Promise<ReadonlyArray<Transaction>>
    {
        return Promise.resolve(this._transactions.where(t => !t.isDeleted));
    }

    public getTransaction(id: string): Promise<Transaction>
    {
        given(id, "id").ensureHasValue().ensureIsString();

        return Promise.resolve(this._transactions.find(t => t.id === id) as Transaction);
    }

    public createTransaction(name: string, description: string, transactionType: string, transactionCurrency: string, amount: number): Promise<Transaction>
    {
        given(name, "name").ensureHasValue().ensureIsString();
        given(description, "description").ensureIsString();
        given(transactionType, " transactionType");
        given(transactionCurrency, " transactionType");
        given(amount, "amount");


        const transaction = new MockTransactionProxy("id" + this._counter++, name, description, transactionType, transactionCurrency, amount);
        this._transactions.push(transaction);
        return Promise.resolve(transaction);
    }
}







