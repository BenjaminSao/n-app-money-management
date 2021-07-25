export interface MarketingService
{
    contactUs(name: string, email: string, message: string): Promise<void>;
}