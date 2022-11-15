import { computed, onMounted, ref } from "vue";
import { defineStore } from "pinia";
import type { UserModel } from "@/model/user_model";

export const useAuthStore = defineStore("auth_store", () => {
  onMounted(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  });

  const user = ref<UserModel | null>(null);
  const isAutheticated = ref(computed(() => user.value !== null));

  function setUser(newUser: UserModel | null) {
    user.value = newUser;
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    }else{
      localStorage.removeItem("user");
    }
  }

  function logout() {
    setUser(null);
    /// TODO: remove token from cookie
  }

  return { user, isAutheticated, setUser, logout };
});
