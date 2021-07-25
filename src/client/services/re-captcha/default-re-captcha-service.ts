import { ConfigurationManager } from "@nivinjoseph/n-config";
import { given } from "@nivinjoseph/n-defensive";
import { ReCaptchaService } from "./re-captcha-service";

declare var grecaptcha: ReCaptcha;


export class DefaultReCaptchaService implements ReCaptchaService
{
    private readonly _siteKey;

    public constructor() 
    {
        this._siteKey = ConfigurationManager.getConfig<string>("reCaptchaSiteKey");
    }


    public async challenge(action: string): Promise<string>
    {
        given(action, "action").ensureHasValue().ensureIsString();

        await this._ensureReCaptchaReady();
        const token = await grecaptcha.execute(this._siteKey, { action });

        return token;
    }


    private _ensureReCaptchaReady(): Promise<void>
    {
        return new Promise<void>((resolve, _) =>
        {
            grecaptcha.ready(resolve);
        });
    }
}



interface ReCaptcha
{
    // executes the given callback when the reCaptcha api is loaded
    ready(callback: () => void): void;

    // executes a challenge for the given siteKey and action  
    // returns a token that must be sent to the server.
    execute(siteKey: string, options: {
        action: string,
    }): Promise<string>;
}