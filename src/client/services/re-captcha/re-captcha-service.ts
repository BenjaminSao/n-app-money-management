export interface ReCaptchaService
{
    challenge(action: string): Promise<string>;
}