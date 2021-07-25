import { given } from "@nivinjoseph/n-defensive";
import { inject } from "@nivinjoseph/n-ject";
import { ReCaptchaService } from "../re-captcha/re-captcha-service";
import { RpcClient } from "../comms/rpc-client";
import { MarketingService } from "./marketing-service";


@inject("AnonymousClient", "ReCaptchaService")
export class RemoteMarketingService implements MarketingService
{
    private readonly _anonymousClient: RpcClient;
    private readonly _reCaptchaService: ReCaptchaService;


    public constructor(anonymousClient: RpcClient, reCaptchaService: ReCaptchaService)
    {
        given(anonymousClient, "anonymousClient").ensureHasValue().ensureIsObject();
        this._anonymousClient = anonymousClient;

        given(reCaptchaService, "reCaptchaService").ensureHasValue().ensureIsObject();
        this._reCaptchaService = reCaptchaService;
    }


    public async contactUs(name: string, email: string, message: string): Promise<void>
    {
        given(name, "name").ensureHasValue().ensureIsString();
        name = name.trim();

        given(email, "email").ensureHasValue().ensureIsString();
        email = email.trim();

        given(message, "message").ensureHasValue().ensureIsString();
        message = message.trim();

        const token = await this._reCaptchaService.challenge("contactUs");

        const command = {
            name,
            email,
            message,
            token,
        };

        await this._anonymousClient.command<void>("/api/command/contactUs", command);
    }
}