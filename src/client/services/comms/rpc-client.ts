import * as Axios from "axios";
import { given } from "@nivinjoseph/n-defensive";
import { ConfigurationManager } from "@nivinjoseph/n-config";
import { RpcException } from "./rpc-exception";


export class RpcClient
{
    private readonly _api: Axios.AxiosInstance;
    private readonly _headers: { [index: string]: string };


    public constructor(baseUrl?: string)
    {
        this._api = Axios.default.create({
            baseURL: baseUrl || ConfigurationManager.getConfig<string>("apiUrl"),
            timeout: 60000
        });

        this._headers = {};
    }


    public setHeader(key: string, value: any): void
    {
        given(key, "key").ensureHasValue().ensureIsString();

        this._headers[key] = value;
    }

    public async query<T>(url: string): Promise<T>
    {
        given(url, "url").ensureHasValue().ensureIsString()
            .ensure(t => t.trim().startsWith("/"), "must start with '/'");

        url = url.trim();

        let response: Axios.AxiosResponse<T> = null as any;
        try 
        {
            response = await this._api.get(url, { headers: this._headers });
        }
        catch (error)
        {
            console.warn("RPC ERROR", error.response.status, error.response.data);
            throw new RpcException(error.response.status, error.response.data);
        }

        return response.data;
    }

    public async command<T>(url: string, command: object): Promise<T>
    {
        given(url, "url").ensureHasValue().ensureIsString()
            .ensure(t => t.trim().startsWith("/"), "must start with '/'");

        url = url.trim();

        given(command, "command").ensureHasValue().ensureIsObject();

        let response: Axios.AxiosResponse<T> = null as any;
        try 
        {
            response = await this._api.post(url, command, { headers: this._headers });
        }
        catch (error)
        {
            console.warn("RPC ERROR", error.response.status, error.response.data);
            throw new RpcException(error.response.status, error.response.data);
        }

        return response.data;
    }
}