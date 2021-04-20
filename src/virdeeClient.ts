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
    variables: Record<string, unknown> | unknown
  ): Promise<VirdeeResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
      "X-Request-ID": this.reqId,
    };

    if (authorized === AuthStatus.auth) {
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    }

    const unknownErrorMessage = "Unknown error";

    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables }),
      });

      try {
        if (response?.ok) {
          const jsonResponse = await response.json();

          return jsonResponse;
        }
        // If response not okay, throw.
        throw new Error("Response is not ok");
      } catch (error) {
        const textResponse = await response.text();
        // If error in try, raise error with message, response text, and response status.

        let message = unknownErrorMessage;

        if (error instanceof Error) {
          message = error.message;
        }

        throw new Error(
          `errorMessage: ${message}; responseText: ${textResponse}; responseStatus: ${response.status}`
        );
      }
    } catch (error) {
      /* If request fails or error when calling .json or .text; 
      Raise the error so we can see and log it in the service using virdee client 
      */

      let message = unknownErrorMessage;

      if (error instanceof Error) {
        message = error.message;
      }

      throw new Error(message);
    }
  }
}
