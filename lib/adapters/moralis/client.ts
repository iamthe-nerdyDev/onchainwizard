import { HttpClient } from "@/lib/http.util";
import { Logger } from "@/lib/logger";
import { AxiosError, AxiosResponse } from "axios";

export default class MoralisClient extends HttpClient {
  constructor() {
    super({
      baseURL: "https://solana-gateway.moralis.io",
      headers: {
        "X-API-Key": process.env.MORALIS_APIKEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  _handleResponse({ data }: AxiosResponse<any>) {
    Logger.green(JSON.stringify(data, null, 2));
    return { error: false, data };
  }

  _handleError(error: AxiosError<any>) {
    Logger.red(JSON.stringify(error.toJSON(), null, 2));

    if (error.response) {
      const { data } = error.response;
      return { error: true, data };
    }

    return { error: true };
  }

  getInstance() {
    return this.instance;
  }
}
