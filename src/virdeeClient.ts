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

export class VirdeeClient {
  public url: string;
  public bearerToken: string;
  public logger: any;
  private interval = 200;
  constructor(url: string, options: OptionsObject = {}) {
    this.url = url;
    this.bearerToken = options.bearerToken || "";
    this.logger = options.logger || undefined;
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
        return json;
      })
      .catch(async () => {
        if (retries === 0) {
          throw new Error("Maximum retries exceeded");
        }
        if (this.logger && this.logger.info) {
          this.logger.info("sendGraphQL retrying");
        }
        await this.waitInterval();
        return await this.sendGraphQL(
          query,
          variables,
          authorized,
          retries - 1
        );
      });
  }
}
