import axiosCatch from "@/helpers/axios_catch";
import { http } from "@/helpers/axios_service";
import type { UserModel } from "@/model/user_model";
import type { AxiosInstance } from "axios";
import type { StandartRepsonse } from "@/model/response_model";

interface IAuthController {
  login(username: string, password: string): Promise<UserModel | null>;
  logout(): Promise<boolean>;
  activate(token: String): Promise<boolean>;
  register(
    username: string,
    email: string,
    password: string
  ): Promise<boolean>;
}

export default class AuthController implements IAuthController {
  http: AxiosInstance;

  constructor() {
    this.http = http();
  }

  async register(
    username: String,
    email: String,
    password: String
  ): Promise<boolean> {
    const body = {
      username: username,
      email: email,
      password: password,
    };
    try {
      await this.http.post("/register", body);
      return true
    } catch (error) {
      axiosCatch(error);
      return false;
    }
  }

  async login(
    username: String,
    password: String
  ): Promise<UserModel | null> {
    const body = {
      username: username,
      password: password,
    };
    try {
      const res = await this.http.post<StandartRepsonse<UserModel>>(
        "/login",
        body
      );
      return res.data.data as UserModel;
    } catch (error) {
      axiosCatch(error);
      return null;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const res = await this.http.get<StandartRepsonse<Object>>("/logout");
      return !!res.data.status;

    } catch (error) {
      axiosCatch(error);
      return false;
    }
  }

  async activate(token: String): Promise<boolean> {
    try {
      const res = await this.http.post<StandartRepsonse<Object>>("/activate", {
        token: token,
      });
      return !!res.data.status;

    } catch (error) {
      axiosCatch(error);
      return false;
    }
  }
}
