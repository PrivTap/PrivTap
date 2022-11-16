import Route from "../../Route";
import { Request, Response } from "express";
import { success } from "../../helper/http";

export default class LogoutRoute extends Route {
  constructor() {
    super("logout", true);
  }

  protected async httpGet(request: Request, response: Response): Promise<void> {
    if (process.env.NODE_ENV != "production") {
      response.header("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
      response.header("Access-Control-Allow-Credentials", "true");
    }

    response.clearCookie("_jwt");
    success(response, {}, "Logged out");
  }
}
