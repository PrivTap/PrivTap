import { computed, onMounted, ref, type ComputedRef, type Ref } from "vue";
import { defineStore } from "pinia";
import type { UserModel } from "@/model/user_model";
import { getCurrentInstance } from "vue";
import AuthService from "@/services/auth_service";
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
    const res = await _authService.login(username, password);
    if (!res.status) return toast.error(res.message);
    setUser(res.data as UserModel);
    toast.success("Login Success!");
    router.push(RoutingPath.HOME);
  }

  async function register(
    username: String,
    email: String,
    password: String
  ): Promise<boolean> {
    const res = await _authService.register(username, email, password);
    if (!res.status) {
      toast.error(res.message);
      return false;
    }
    toast.success(
      "Registration Success! Please check your email to activate your account."
    );
    router.push(RoutingPath.HOME);
    return true;
  }
  async function activate(token: String) {
    const res = await _authService.activate(token);
    if (!res.status) {
      toast.error(res.message);
      return;
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
