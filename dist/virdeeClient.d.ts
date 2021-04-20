import { Logger } from "pino";
declare type VirdeeResponse = ResponseObject;
interface ResponseObject {
    errors?: Array<unknown>;
    data?: unknown;
}
interface ClientOptions {
    reqId: string;
    logger: Logger;
    bearerToken?: string;
}
export declare enum AuthStatus {
    noAuth = "noAuth",
    auth = "auth"
}
export declare class VirdeeClient {
    url: string;
    bearerToken: string;
    log: Logger;
    reqId: string;
    constructor(url: string, options: ClientOptions);
    sendGraphQL(query: string, authStatus: AuthStatus, variables?: Record<string, unknown>): Promise<VirdeeResponse>;
    sendGraphQLAuth(query: string, variables?: Record<string, unknown>): Promise<VirdeeResponse>;
    sendGraphQLUnauth(query: string, variables?: Record<string, unknown>): Promise<VirdeeResponse>;
    private internalSendGraphQL;
}
export {};
