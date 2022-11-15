import type { UserModel } from "@/model/user_model";
import { useAuthStore } from "@/stores/auth_store";
import type { AxiosError, AxiosResponse } from "axios";
import { useToast } from "vue-toastification";
import http from "../http-common";

type AuthResponse = {
  _status: boolean;
  _message: String;
  _data?: {};
};

class AuthService {
  async register(
    username: String,
    email: String,
    password: String
  ): Promise<AuthResponse> {
    const body = {
      username: username,
      email: email,
      password: password,
    };
    try {
      const res = await http.post<AuthResponse>("/register", body);
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.data) {
        return err.response?.data as AuthResponse;
      }
      return {
        _status: false,
        _message: "Somenthing went wrong..",
      } as AuthResponse;
    }
  }

  async login(username: String, password: String): Promise<AuthResponse> {
    const body = {
      username: username,
      password: password,
    };
    try {
      const res = await http.post<AuthResponse>("/login", body);
      if (res.status === 200 && res.data._data) {
        useAuthStore().setUser(res.data._data as UserModel);
      }
      return res.data;
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.data) {
        return err.response?.data as AuthResponse;
      }
      return {
        _status: false,
        _message: "Somenthing went wrong..",
      } as AuthResponse;
    }
  }

  /// TODO: Add logout function
  logout() {}

  async activate(token: String): Promise<AxiosResponse> {
    return await http.post("/activate", { token: token });
  }
}

export default new AuthService();
