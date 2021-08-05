import { Transaction } from "./transaction";
import { given } from "@nivinjoseph/n-defensive";


export class MockTransactionProxy implements Transaction
{
    private readonly _id: string;
    private _name: string;
    private _description: string;
    private _transactionType: string;
    private _transactionCurrency: string;
    private _amount: number;
    private _isDeleted: boolean;


    public get id(): string { return this._id; }
    public get name(): string { return this._name; }
    public get description(): string { return this._description; }
    public get transactionType(): string { return this._transactionType; }
    public get transactionCurrency(): string { return this._transactionCurrency; }
    public get amount(): number { return this._amount; }
    public get isDeleted(): boolean { return this._isDeleted; }


    public constructor(id: string, name: string, description: string, transactionType: string, transactionCurrency: string, amount: number)
    {
        given(id, "id").ensureHasValue().ensureIsString();
        this._id = id.trim();

        given(name, "name").ensureHasValue().ensureIsString();
        this._name = name;

        given(description as string, "description").ensureIsString();
        this._description = description;

        given(transactionType, "transactionType").ensureHasValue().ensureIsString();
        this._transactionType = transactionType;

        given(transactionCurrency, "transactionCurrency").ensureHasValue().ensureIsString();
        this._transactionCurrency = transactionCurrency;

        given(amount, "amount").ensureHasValue();
        this._amount = amount;

        this._isDeleted = false;
    }


    public async update(name: string, description: string, transactionType: string, transactionCurrency: string, amount: number): Promise<void>
    {
        given(name, "name").ensureHasValue().ensureIsString();
        given(description as string, "description").ensureIsString();
        given(transactionType, "transactionType").ensureHasValue().ensureIsString();
        given(transactionCurrency, "transactionCurrency").ensureHasValue().ensureIsString();
        given(amount, "amount").ensureHasValue();

        this._name = name.trim();
        this._description = description ? description.trim() : null as any;
        this._transactionType = transactionType;
        this._transactionCurrency = transactionCurrency;
        this._amount = amount;
    }

    public async delete(): Promise<void>
    {
        given(this, "this").ensure(t => !t._isDeleted);

        this._isDeleted = true;
    }
}







