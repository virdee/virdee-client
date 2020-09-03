import fetch from "node-fetch";

type VirdeeResponse = ResponseObject;

interface ResponseObject {
  errors?: Array<unknown>;
  data?: any;
}

interface OptionsObject {
  logger?: any;
  bearerToken?: string;
}

export enum AuthStatus {
  noAuth = "noAuth",
  auth = "auth",
}

class RequestError extends Error {
  constructor(message) {
    super(message);
  }
}

export class VirdeeClient {
  public url: string;
  public bearerToken: string;
  public logger: any;
  private interval = 200;
  constructor(url: string, options: OptionsObject = {}) {
    this.url = url;
    this.bearerToken = options.bearerToken || "";
    this.logger = options.logger || console;
  }

  waitInterval(): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, this.interval));
  }

  async sendGraphQL(
    query: string,
    variables?: Record<string, unknown>,
    authorized: AuthStatus = AuthStatus.noAuth,
    retries = 5
  ): Promise<VirdeeResponse> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };
    if (authorized === AuthStatus.auth)
      headers["Authorization"] = `Bearer ${this.bearerToken}`;
    return fetch(this.url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    })
      .then(async (res) => {
        const json = await res.json();

        if (res.status !== 200) {
          const err = new RequestError(
            `status: ${res.status} ${JSON.stringify(json)}`
          );
          throw err;
        }

        return json;
      })
      .catch(async (e) => {
        if (e instanceof RequestError) {
          throw e;
        }

        this.logger.error(e, "virdee-client error");

        if (retries === 0) {
          throw new Error("Maximum retries exceeded");
        }

        await this.waitInterval();

        if (this.logger && this.logger.info) {
          this.logger.info("sendGraphQL retrying");
        }

        return await this.sendGraphQL(
          query,
          variables,
          authorized,
          retries - 1
        );
      });
  }
}
