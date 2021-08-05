export class Routes
{
    public static readonly listTransactions = "/list-transactions";
    public static readonly manageTransactions = "/manage?{id?:string}";
    public static readonly default = Routes.listTransactions;
}
// codes above did not work .reason to be checked
// export const listTransactions = "/transactions";
// export const manageTransactions = "/manage?{id?:string}";
