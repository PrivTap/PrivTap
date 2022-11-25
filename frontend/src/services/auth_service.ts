import axiosCatch from "@/helpers/axios_catch";
import type { UserModel } from "@/model/user_model";
import type { AxiosError } from "axios";
import AxiosService from "../helpers/axios_service";
import type { StandartRepsonse } from "../model/response_model";

interface IAuthService {
  login(username: string, password: string): Promise<UserModel | null>;
  logout(): Promise<boolean>;
  activate(token: String): Promise<boolean>;
  register(
    username: string,
    email: string,
    password: string
  ): Promise<boolean>;
}

export default class AuthService extends AxiosService implements IAuthService {
  constructor() {
    super();
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
      const res = await this.http.post("/register", body);
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
      if (res.data.status) return true
      return false;
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
      if (res.data.status) return true;
      return false;
    } catch (error) {
      axiosCatch(error);
      return false;
    }
  }
}
