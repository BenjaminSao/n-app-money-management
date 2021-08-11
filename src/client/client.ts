import "@babel/polyfill";
import "@nivinjoseph/n-ext";
import "./styles/main.scss";
import * as $ from "jquery";
(<any>window).jQuery = $; (<any>window).$ = $;
import "material-design-icons/iconfont/material-icons.css";
import { ClientApp, Vue } from "@nivinjoseph/n-app";

import { pages } from "./pages";
import { ComponentInstaller, Registry } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { MockTransactionService } from "../sdk/services/transaction-service/mock-transaction-service";
import { components } from "./components";
import { MockCurrencyConversionService } from "../sdk/services/currency-conversion-service/mock-currency-conversion-service";
import { Routes } from "./pages/routes";
console.log(Vue);
// import { ConfigurationManager }pascal cas from "@nivinjoseph/n-config";
// Element-UI stuff
// import * as Element from "element-ui"; // https://element.eleme.io/#/en-US/component
// @ts-ignore
// import locale from "element-ui/lib/locale/lang/en";


// Vue.use(Element, { locale });

// const isDev = ConfigurationManager.getConfig<string>("env") === "dev";
// const isProd = ConfigurationManager.getConfig<string>("env") === "prod";


class Installer implements ComponentInstaller
{
    public install(registry: Registry): void
    {
        given(registry, "registry").ensureHasValue().ensureIsObject();
        registry.registerSingleton("TransactionService", MockTransactionService);
        registry.registerSingleton("CurrencyConversionService", MockCurrencyConversionService);
        // Types of dependencies: 
        // registerSingleton: Singleton, one instance of the dependency class through out the lifecycle of the app.
        // registry.registerTransient: Transient, new instance of the dependency class is created when it needs to be injected.
        // registry.registerScoped: Scoped dependency, same instance is used if it's the same scope, else it it's new instance. 
        //                          Eg: Page and a component in that page will get the same instance of the dependency, while another page will get a new instance of the dependency.
        // registry.registerInstance: Instance dependency, similar to singleton, only deference is you provide the instance, and the instance is not created by the framework. 
    }
}


const client = new ClientApp("#app", "shell")
    .useInstaller(new Installer())
    .useAccentColor("#008f7f")
    .registerComponents(...components)
    .registerPages(...pages)
    // .useAsInitialRoute(Routes.default)
    // .useAsUnknownRoute(Routes.default)
    .useAsInitialRoute(Routes.listTransactions)
    .useAsUnknownRoute(Routes.listTransactions)
    .useHistoryModeRouting();

client.bootstrap();