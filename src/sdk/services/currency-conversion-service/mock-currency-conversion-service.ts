// import { MockTransactionProxy } from "../../proxies/transaction/mock-transaction-proxy";
import { Transaction } from "../../proxies/transaction/transaction";
import { CurrencyConversionService } from "./currency-conversion-service";


export class MockCurrencyConversionService implements CurrencyConversionService
{

    public async fetchCadValue(transaction: Transaction): Promise<number>
    {
        const baseValue = this._convertTransactionToBaseValue(transaction);

        if (baseValue)
            return baseValue;

        throw new Error("Error Converting Value");
    }

    public async fetchInrValue(transaction: Transaction): Promise<number>
    {
        const baseValue = this._convertTransactionToBaseValue(transaction);

        if (baseValue)
            return baseValue * 50;

        throw new Error("Error Converting Value");
    }

    public async fetchThbValue(transaction: Transaction): Promise<number>
    {
        const baseValue = this._convertTransactionToBaseValue(transaction);

        if (baseValue)
            return baseValue * 25;

        throw new Error("Error Converting Value");
    }

    // Value in CAD
    private _convertTransactionToBaseValue(transaction: Transaction): number | null
    {
        if (transaction.transactionCurrency === "CAD")
            return transaction.amount;

        if (transaction.transactionCurrency === "INR")
            return transaction.amount / 50;

        if (transaction.transactionCurrency === "THB")
            return transaction.amount / 25;

        return null;
    }
}

