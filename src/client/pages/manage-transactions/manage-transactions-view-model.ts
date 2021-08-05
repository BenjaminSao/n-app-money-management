import { PageViewModel, route, template, NavigationService } from "@nivinjoseph/n-app";
import "./manage-transactions-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { Validator, strval } from "@nivinjoseph/n-validate";
import { TransactionService } from "../../../sdk/services/transaction-service/transaction-service";
import { Transaction } from "../../../sdk/proxies/transaction/transaction";
import { Routes } from "../routes";


@template(require("./manage-transactions-view.html"))
@route(Routes.manageTransactions)
@inject("TransactionService", "NavigationService")
export class ManageTransactionsViewModel extends PageViewModel
{

    private readonly _transactionService: TransactionService;
    private readonly _navigationService: NavigationService;

    private _isNew: boolean;
    private _transaction: Transaction | null;
    private _name: string;
    private _description: string;
    private _transactionType: string;
    private _transactionCurrency: string;
    private _amount: number;
    private readonly _validator: Validator<this>;


    public get isNew(): boolean { return this._isNew; }
    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; } // setter so the input field can set the new val

    public get description(): string { return this._description; }
    public set description(value: string) { this._description = value; }

    public get transactionType(): string { return this._transactionType; }
    public set transactionType(value: string) { this._transactionType = value; }

    public get transactionCurrency(): string { return this._transactionCurrency; }
    public set transactionCurrency(value: string) { this._transactionCurrency = value; }

    public get amount(): number { return this._amount; }
    public set amount(value: number) { this._amount = value; }

    public get hasErrors(): boolean { return !this.validate(); }
    public get errors(): Object { return this._validator.errors; }

    public constructor(transactionService: TransactionService, navigationService: NavigationService)
    {
        super();
        given(transactionService, "transactionService").ensureHasValue().ensureIsObject();
        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();

        this._transactionService = transactionService;
        this._navigationService = navigationService;
        this._isNew = false;
        this._transaction = null;
        this._name = "";
        this._description = "";
        this._transactionType = "";
        this._transactionCurrency = "";
        this._amount = 0;
        this._validator = this.createValidator();
    }
    public async save(): Promise<void>
    {
        this._validator.enable();
        if (!this.validate())
            return;

        try
        {
            if (this._transaction)
                await this._transaction.update(this._name, this._description, this._transactionType, this._transactionCurrency, this._amount);
            else
                await this._transactionService.createTransaction(this._name, this._description, this._transactionType, this._transactionCurrency, this._amount);
        } catch (e)
        {
            console.log(e);
            return;
        }

        this._navigationService.navigate(Routes.listTransactions);
    }

    protected override onEnter(id?: string): void // getting the path parameter from the url
    {
        if (id && !id.isEmptyOrWhiteSpace())
        {
            this._isNew = false;

            this._transactionService.getTransaction(id)
                .then(t =>
                {
                    this._transaction = t;

                    this._name = t.name;
                    this._description = t.description || "";
                    this._transactionType = t.transactionType;
                    this._transactionCurrency = t.transactionCurrency;
                    this._amount = t.amount;
                })
                .catch(e => console.log(e));
        }
        else
        {
            this._isNew = true;
        }
    }
    private validate(): boolean
    {
        this._validator.validate(this);
        return this._validator.isValid;
    }
    private createValidator(): Validator<this>
    {
        const validator = new Validator<this>(true);

        validator
            .prop("name")
            .isRequired().withMessage("The name field is required.")
            .isString()
            .useValidationRule(strval.hasMaxLength(50));

        validator
            .prop("description")
            .isOptional()
            .isString()
            .useValidationRule(strval.hasMaxLength(500));
        validator
            .prop("transactionType")
            .isRequired().withMessage("The transaction type is required.")
            .isString();
        validator
            .prop("transactionCurrency")
            .isRequired().withMessage("The currency type is required.")
            .isString();
        validator
            .prop("amount")
            .isRequired().withMessage("amount is required.");
        return validator;
    }

}



