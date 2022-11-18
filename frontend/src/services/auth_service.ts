import type { UserModel } from "@/model/user_model";
import { useAuthStore } from "@/stores/auth_store";
import type { AxiosError } from "axios";
import IAxiosService from "../helpers/axios_service";
import type { StandartRepsonse } from "../model/response_model";


interface IAuthService extends IAxiosService {
  login(username: string, password: string): Promise<StandartRepsonse<Object>>;
  logout(): Promise<StandartRepsonse<Object>>;
  activate(token: String): Promise<StandartRepsonse<Object>>;
  register(
    username: string,
    email: string,
    password: string
  ): Promise<StandartRepsonse<Object>>;
}

class AuthService extends IAxiosService implements IAuthService {

  async register(
    username: String,
    email: String,
    password: String
  ): Promise<StandartRepsonse<Object>> {
    
    const body = {
      username: username,
      email: email,
      password: password,
    };
    try {
      const res = await this.http.post("/register", body);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.data) {
        return err.response?.data as StandartRepsonse<Object>;
      }
      return {
        status: false,
        message: "Somenthing went wrong..",
      } as StandartRepsonse<Object>;
    }
  }

  async login(username: String, password: String): Promise<StandartRepsonse<Object>> {
    const body = {
      username: username,
      password: password,
    };
    try {
      const res = await this.http.post<StandartRepsonse<UserModel>>("/login", body);
      if (res.status === 200 && res.data.data) {
        useAuthStore().setUser(res.data.data);
      }
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.data) {
        return err.response?.data as StandartRepsonse<Object>;
      }
      return {
        status: false,
        message: "Somenthing went wrong..",
      } as StandartRepsonse<Object>;
    }
  }

  async logout(): Promise<StandartRepsonse<Object>> {
    try {
      const res = await this.http.get<StandartRepsonse<Object>>("/logout");
      useAuthStore().logout();
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.data) {
        return err.response?.data as StandartRepsonse<Object>;
      }
      return {
        status: false,
        message: "Somenthing went wrong..",
      } as StandartRepsonse<Object>;
    }
  }

  async activate(token: String): Promise<StandartRepsonse<Object>> {
    try {
      const res = await this.http.post<StandartRepsonse<Object>>("/activate", { token: token });
      return res.data;
    } catch (error) {
      return {
        status: false,
        message: "Somenthing went wrong..",
      } as StandartRepsonse<Object>;
    }
  }
}

export default new AuthService();
