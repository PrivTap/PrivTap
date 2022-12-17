import { computed, onMounted, ref, type ComputedRef, type Ref } from "vue";
import { defineStore } from "pinia";
import type { UserModel } from "@/model/user_model";
import { getCurrentInstance } from "vue";
import AuthService from "../controllers/auth_controller";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import RoutingPath from "@/router/routing_path";
export default interface IAuthStoreState {
  user: Ref<UserModel | null>;
  setUser: (user: UserModel | null) => void;
  logout: (from401: boolean) => void;
  login: (username: String, password: String) => void;
  isAutheticated: ComputedRef<boolean>;
  register: (
    username: String,
    email: String,
    password: String
  ) => Promise<boolean>;
  activate: (token: String) => Promise<void>;
}

export const useAuthStore = defineStore("auth_store", (): IAuthStoreState => {
  // Function onMounted called when the component is mounted
  if (getCurrentInstance()) {
    onMounted(() => {
      const user = localStorage.getItem("user");
      if (user) {
        setUser(JSON.parse(user));
      }
    });
  }

  const user = ref<UserModel | null>(null);
  const isAutheticated = ref(computed(() => user.value !== null));
  const _authService = new AuthService();
  const toast = useToast();
  const router = useRouter();

  function setUser(newUser: UserModel | null) {
    user.value = newUser;
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  }

  async function login(username: String, password: String) {
    const user = await _authService.login(username, password);
    if (!user) return
    setUser(user);
    toast.success("Login Success!");
    router.replace(RoutingPath.HOME);
  }

  async function register(
    username: String,
    email: String,
    password: String
  ): Promise<boolean> {
    const res = await _authService.register(username, email, password);
    if (!res) return res;
    toast.success(
      "Registration Success! Please check your email to activate your account."
    );
    return true;
  }
  async function activate(token: String) {
    const res = await _authService.activate(token);
    if (!res) return;
    const stringUser = localStorage.getItem("user");
    if (!stringUser) {
      if (user.value) {
        user.value.isConfirmed = true;
        setUser(user.value);
      }
    } else {
      const app = JSON.parse(stringUser) as UserModel;
      app.isConfirmed = true;
      setUser(app);
    }
    toast.success("Account activated successfully!");
  }

  async function logout(from401 = false) {
    if (!from401) _authService.logout();
    setUser(null);
    return toast.success("Logout success!");
  }

  return { user, isAutheticated, setUser, logout, login, register, activate };
});
