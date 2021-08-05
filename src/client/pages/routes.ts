export class Routes
{
    public static readonly listTransactions = "/list-transactions";
    public static readonly manageTransactions = "/manage?{id?:string}";
    public static readonly default = Routes.listTransactions;
}



