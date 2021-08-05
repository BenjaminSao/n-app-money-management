import { components, PageViewModel, route, template } from "@nivinjoseph/n-app";
import { TransactionViewModel } from "./components/transaction/transaction-view-model";
import "./list-transactions-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { TransactionService } from "../../../sdk/services/transaction-service/transaction-service";
import { Transaction } from "../../../sdk/proxies/transaction/transaction";
import { Routes } from "../routes";
import { CurrencyConversionService } from "../../../sdk/services/currency-conversion-service/currency-conversion-service";


@template(require("./list-transactions-view.html"))
@route(Routes.listTransactions)
@components(TransactionViewModel)
@inject("TransactionService", "CurrencyConversionService")
export class ListTransactionsViewModel extends PageViewModel
{
    private readonly _transactionService: TransactionService;
    private readonly _currencyConversionService: CurrencyConversionService;
    private _transactions: ReadonlyArray<Transaction>;
    private _currencyType: string = "CAD";
    private _expenseTotal: number = 0;
    private _incomeTotal: number = 0;


    public get currencyType(): string { return this._currencyType; }
    public set currencyType(value: string) { this._currencyType = value; }
    public get expenseTotal(): number { return this._expenseTotal; }
    public get incomeTotal(): number { return this._incomeTotal; }
    public get netInHand(): number { return this._incomeTotal - this._expenseTotal; }
    public get transactions(): ReadonlyArray<Transaction> { return this._transactions?.where(t => !t.isDeleted) ?? []; }


    public constructor(transactionService: TransactionService, currencyConversionService: CurrencyConversionService) 
    {
        super();

        given(transactionService, "transactionService").ensureHasValue().ensureIsObject();
        this._transactionService = transactionService;

        given(currencyConversionService, "currencyConversionService").ensureHasValue().ensureIsObject();
        this._currencyConversionService = currencyConversionService;

        this._transactions = [];
    }


    public changeCurrency()
    {
        this._calculateCreditTotal();
        this._calculateDebitTotal();
    }

    public transactionDeleted()
    {
        this._calculateCreditTotal();
        this._calculateDebitTotal();
        console.log("this method is called");
    }


    protected override onEnter(): void
    {
        super.onEnter();

        console.log("onEnter, when the page has appeared, usually used to fetch data to show on the page. The parameters for this function would be any query/path params of the url defined in the route");

        this._transactionService.getTransactions()
            .then(t =>
            {
                this._transactions = t;
                this._calculateCreditTotal();
                this._calculateDebitTotal();
            })
            .catch(e => console.log(e));
    }


    private _calculateCreditTotal(): void
    {
        const creditTransactions = this._transactions.where(t => t.transactionType === "Credit" && !t.isDeleted);

        this._getConvertedValue(creditTransactions).then(t => this._incomeTotal = t).catch(e => console.error(e));
    }

    private _calculateDebitTotal(): void
    {
        const debitTransactions = this._transactions.where(t => t.transactionType === "Debit" && !t.isDeleted);

        this._getConvertedValue(debitTransactions).then(t => this._expenseTotal = t).catch(e => console.error(e));
    }

    private async _getConvertedValue(transactions: Array<Transaction>): Promise<number>
    {
        let convertedValue = 0;

        if (this._currencyType === "CAD")
        {
            for (let i = 0; i < transactions.length; i++)
            {
                convertedValue += await this._currencyConversionService.fetchCadValue(transactions[i]);
            }
        }

        if (this._currencyType === "THB")
        {
            for (let i = 0; i < transactions.length; i++)
            {
                convertedValue += await this._currencyConversionService.fetchThbValue(transactions[i]);
            }
        }

        if (this._currencyType === "INR")
        {
            for (let i = 0; i < transactions.length; i++)
            {
                convertedValue += await this._currencyConversionService.fetchInrValue(transactions[i]);
            }
        }

        return convertedValue;
    }
}


