import { ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth_store", () => {
  const isAutheticated = ref<boolean>(false);

  return { isAutheticated };
});
