import { ComponentViewModel, element, template, bind, NavigationService, events } from "@nivinjoseph/n-app";
import "./transaction-view.scss";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { Transaction } from "../../../../../sdk/proxies/transaction/transaction";
import { Routes } from "../../../routes";


@template(require("./transaction-view.html"))
@element("transaction")
@bind("value")
@events("transactionDeleted")
@inject("NavigationService")
export class TransactionViewModel extends ComponentViewModel
{
    private readonly _navigationService: NavigationService;


    public get transaction(): Transaction { return this.getBound<Transaction>("value"); }


    public constructor(navigationService: NavigationService)
    {
        super();

        given(navigationService, "navigationService").ensureHasValue().ensureIsObject();
        this._navigationService = navigationService;
    }

    public editTransaction(): void
    {
        this._navigationService.navigate(Routes.manageTransactions, { id: this.transaction.id });
    }

    public async deleteTransaction(): Promise<void>
    {
        let deleteTransaction = this.transaction.name;
        let result = confirm("press Ok to delete : " + deleteTransaction);
        if (result)
        {
            try
            {
                await this.transaction.delete();

                this.emit("transactionDeleted");

                console.log("step 1");
            }
            catch (e)
            {
                console.log(e);
            }
        }
    }
}









