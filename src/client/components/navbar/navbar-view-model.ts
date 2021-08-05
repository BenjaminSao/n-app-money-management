import { ComponentViewModel, template, element } from "@nivinjoseph/n-app";
import "./navbar-view.scss";


@template(require("./navbar-view.html"))
@element("navbar")
export class NavbarViewModel extends ComponentViewModel {


    public get title(): string {
        return "Expense Tracker";
    }

}