import { HttpClient } from "@/lib/http.util";
import { Logger } from "@/lib/logger";
import { AxiosError, AxiosResponse } from "axios";

export default class AppClient extends HttpClient {
  constructor() {
    super({
      baseURL: "/api",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
  }

  _handleResponse({ data }: AxiosResponse<any>) {
    Logger.green(JSON.stringify(data, null, 2));
    const { success, messaage, data: responseData } = data;
    if (!success) {
      return {
        error: true,
        messaage,
        data: responseData,
      };
    }

    return {
      error: false,
      messaage,
      data: responseData,
    };
  }

  _handleError(error: AxiosError<any>) {
    Logger.red(JSON.stringify(error.toJSON(), null, 2));

    if (error.response) {
      const { data } = error.response;
      return {
        error: true,
        message: data.message,
        data: data.data,
      };
    }

    return { error: true };
  }

  getInstance() {
    return this.instance;
  }
}
