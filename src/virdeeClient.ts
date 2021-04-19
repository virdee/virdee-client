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

class RequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class VirdeeClient {
  public url: string;
  public bearerToken: string;
  public log: Logger;
  public reqId: string;
  private interval = 200;
  private retries: number;

  constructor(url: string, options: ClientOptions) {
    this.url = url;
    this.bearerToken = options.bearerToken || "";
    this.log = options.logger;
    this.reqId = options.reqId;
    this.retries = options.retries || 5;
  }

  private waitInterval(interval: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, interval));
  }

  async sendGraphQL(
    query: string,
    authStatus: AuthStatus,
    variables?: Record<string, unknown>
  ): Promise<VirdeeResponse> {
    return this.internalSendGraphQLRetries(query, authStatus, variables);
  }

  async sendGraphQLAuth(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<VirdeeResponse> {
    return this.internalSendGraphQLRetries(query, AuthStatus.auth, variables);
  }

  async sendGraphQLUnauth(
    query: string,
    variables?: Record<string, unknown>
  ): Promise<VirdeeResponse> {
    return this.internalSendGraphQLRetries(query, AuthStatus.noAuth, variables);
  }

  private async internalSendGraphQLRetries(
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

    for (let i = 0; i < this.retries; i++) {
      try {
        return await this.internalSendGraphQL(query, variables, headers);
      } catch (e) {
        this.log.error(e, "virdee-client error");

        if (e instanceof RequestError) {
          throw e;
        }

        const interval = this.interval + i * 100; // Increase interval by 100 msed on each retry
        await this.waitInterval(interval);
        this.log.info("sendGraphQL retrying");
      }
    }

    throw new Error("Maximum retries exceeded");
  }

  private async internalSendGraphQL(
    query: string,
    variables: Record<string, unknown> | unknown,
    headers: { [key: string]: string }
  ): Promise<VirdeeResponse> {
    const response = await fetch(this.url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const status = response?.status;

    if (status !== 200) {
      throw new RequestError(`status: ${status}`);
    }

    return response.json();
  }
}
