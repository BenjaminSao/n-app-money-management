export interface Transaction
{
    id: string;
    name: string;
    description: string;
    transactionType: string;
    transactionCurrency: string;
    amount: number;
    isDeleted: boolean;

    update(name: string, description: string, transactionType: string, transactionCurrency: string, amount: number): Promise<void>;
    delete(): Promise<void>;
}


