declare type VirdeeResponse = ResponseObject;
interface ResponseObject {
    errors?: Array<unknown>;
    data?: any;
}
interface OptionsObject {
    logger?: any;
    bearerToken?: string;
}
export declare enum AuthStatus {
    noAuth = "noAuth",
    auth = "auth"
}
export declare class VirdeeClient {
    url: string;
    bearerToken: string;
    logger: any;
    private interval;
    constructor(url: string, options?: OptionsObject);
    waitInterval(): Promise<unknown>;
    sendGraphQL(query: string, variables?: Record<string, unknown>, authorized?: AuthStatus, retries?: number): Promise<VirdeeResponse>;
}
export {};
