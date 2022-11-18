import { computed, onMounted, ref, type ComputedRef, type Ref } from "vue";
import { defineStore } from "pinia";
import type { UserModel } from "@/model/user_model";
import { getCurrentInstance } from "vue";
export default interface IAuthStoreState {
  user: Ref<UserModel | null>;
  setUser: (user: UserModel | null) => void;
  logout: () => void;
  isAutheticated: ComputedRef<boolean>;
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

  function setUser(newUser: UserModel | null) {
    user.value = newUser;
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  }

  function logout() {
    setUser(null);
    /// TODO: remove token from cookie
  }

  return { user, isAutheticated, setUser, logout };
});
