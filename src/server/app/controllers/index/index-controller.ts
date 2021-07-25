import { Controller, route, httpGet, view, CallContext, HttpException } from "@nivinjoseph/n-web";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { inject } from "@nivinjoseph/n-ject";
import { given } from "@nivinjoseph/n-defensive";
import { Logger } from "@nivinjoseph/n-log";


@route("/*")
@httpGet
@view("~/src/client/dist/index-view.html")
@inject("CallContext", "Logger")
export class IndexController extends Controller
{
    private readonly _callContext: CallContext;
    // @ts-ignore
    private readonly _logger: Logger;


    public constructor(callContext: CallContext, logger: Logger)
    {
        super();

        given(callContext, "callContext").ensureHasValue().ensureIsObject();
        this._callContext = callContext;

        given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;
    }


    public async execute(): Promise<object>
    {
        const env = ConfigurationManager.getConfig<string>("env");

        if (env !== "dev")
        {
            // @ts-ignore
            const protocol = this._callContext.getRequestHeader("X-Forwarded-Proto");
            // await this._logger.logWarning(`Protocol:${protocol}.`);
            if (protocol !== "https")
                this.redirect("https" + this._callContext.href.substr(4));
        }

        if (env === "stage")
            this.checkStageCredentials();

        return {
            config: {
                apiUrl: ConfigurationManager.getConfig<string>("apiUrl"),
                reCaptchaSiteKey: ConfigurationManager.getConfig<string>("reCaptchaSiteKey")
            }
        };
    }

    private checkStageCredentials(): void
    {
        const stageCredentials = {
            username: "pxmarket",
            password: "someLongAndConfusingP@$$w0rD"
        };

        let auth = this._callContext.getRequestHeader("authorization");
        if (!auth || auth.isEmptyOrWhiteSpace())
        {
            this._callContext.setResponseHeader("WWW-Authenticate", "Basic");
            throw new HttpException(401);
        }

        auth = auth.trim();
        const authSplit = auth.split(" ");

        if (authSplit.length !== 2 || authSplit[0].trim().toLowerCase() !== "basic" ||
            authSplit[1].isEmptyOrWhiteSpace())
        {
            this._callContext.setResponseHeader("WWW-Authenticate", "Basic");
            throw new HttpException(401);
        }

        const token = Buffer.from(authSplit[1].trim(), "base64").toString("utf8");
        const tokenSplit = token.split(":");
        if (tokenSplit.length !== 2)
        {
            this._callContext.setResponseHeader("WWW-Authenticate", "Basic");
            throw new HttpException(401);
        }

        const username = tokenSplit[0].trim().toLowerCase();
        const password = tokenSplit[1].trim();


        if (username !== stageCredentials.username || password !== stageCredentials.password)
        {
            this._callContext.setResponseHeader("WWW-Authenticate", "Basic");
            throw new HttpException(401);
        }
    }
}