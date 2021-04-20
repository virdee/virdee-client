import fetch from "node-fetch";
import { Logger } from "pino";

type VirdeeResponse = ResponseObject;

interface ResponseObject {
  errors?: Array<unknown>;
  data?: any;
}

interface ClientOptions {
  reqId: string;
  logger: Logger;
  bearerToken?: string;
  retries?: number;
}

export enum AuthStatus {
  noAuth = "noAuth",
  auth = "auth",
}

export class VirdeeClient {
  public url: string;
  public bearerToken: string;
  public log: Logger;
  public reqId: string;

  constructor(url: string, options: ClientOptions) {
    this.url = url;
    this.bearerToken = options.bearerToken || "";
    this.log = options.logger;
    this.reqId = options.reqId;
  }

  async sendGraphQL(
    query: string,
    authStatus: AuthStatus,
    variables?: Record<string, unknown>
  ): Promise<VirdeeResponse> {
    return this.internalSendGraphQL(query, authStatus, variables);
  }

  async sendGraphQLAuth(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<VirdeeResponse> {
    return this.internalSendGraphQL(query, AuthStatus.auth, variables);
  }

  async sendGraphQLUnauth(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<VirdeeResponse> {
    return this.internalSendGraphQL(query, AuthStatus.noAuth, variables);
  }

  private async internalSendGraphQL(
    query: string,
    authorized: AuthStatus,
    variables?: Record<string, unknown>
  ): Promise<VirdeeResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
      "X-Request-ID": this.reqId,
    };

    if (authorized === AuthStatus.auth) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }

    const response = await fetch(this.url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    let textResponse: string | undefined = await response.text();
    let jsonResponse: VirdeeResponse | undefined;

    try {
      try {
        jsonResponse = JSON.parse(textResponse); // This may throw an exception on bad JSON format
        textResponse = undefined; // Json parsing succeeded so no need to log the text
      } catch (e) {
        throw new Error("VirdeeClientError - Error parsing JSON data");
      }

      if (!response?.ok) {
        throw new Error("VirdeeClientError - Bad response");
      }

      return jsonResponse as VirdeeResponse;
    } catch (e) {
      this.log.error(e);
      this.log.error(
        {
          status: response.status,
          textResponse,
          jsonResponse,
        },
        "VirdeeClientError - Bad response data"
      );

      throw e;
    }
  }
}
