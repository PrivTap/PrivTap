<template>
  <div class="flex items-center justify-center p-5 h-screen">
    <div class="max-w-xl space-y-8">
      <div class="rounded-3xl shadow-2xl p-10 bg-blue-600 shadow-blue-500">
        <div>
          <img
            class="mx-auto h-24 w-auto"
            :src= "logo"
          />
          <h1 class="mt-6 text-center tracking-tight text-white">
            {{ showLogin ? "Login into your" : "SignUp a new " }} PrivTAP
            account
          </h1>
        </div>
        <form @submit="onSubmitted" class="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />
          <div class="-space-y-px rounded-md shadow-sm relative">
            <div
              v-if="!showLogin"
              class="relative animate-fade-in placeholder-gray-500"
            >
              <label for="username-id" class="sr-only">Username</label>
              <input
                id="username-id"
                name="username"
                required="true"
                v-model="username"
                class="relative w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-base"
                placeholder="Username"
              />
            </div>
            <div class="placeholder-gray-500">
              <label for="email-address" class="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required="true"
                v-bind:class="{
                  'rounded-t-md': showLogin,
                }"
                v-model="email"
                class="relative w-full appearance-none rounded-none border border-gray-300 px-3 py-2 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-base"
                placeholder="Email address"
              />
            </div>

            <div>
              <label for="password" class="sr-only">Password</label>
              <div
                class="flex relative justify-between items-center bg-white rounded-none rounded-b-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-base"
              >
                <input
                  id="password"
                  name="password"
                  :type="showPass ? 'text' : 'password'"
                  autocomplete="current-password"
                  required="true"
                  v-model="password"
                  class="relative appearance-none outline-none h-full w-full"
                  placeholder="Password"
                />

                <button
                  @click.prevent="showPass = !showPass"
                  class="absolute right-7 top-2"
                >
                  <EyeSlashIcon
                    :class="showPass ? 'opacity-0' : 'opacity-100'"
                    class="w-5 absolute duration-1000 fill-blue-500"
                  ></EyeSlashIcon>
                  <EyeIcon
                    :class="!showPass ? 'opacity-0' : 'opacity-100'"
                    class="w-5 absolute duration-1000 fill-blue-500"
                  ></EyeIcon>
                </button>
              </div>
            </div>
          </div>

          <div
            v-if="showLogin"
            class="flex items-center justify-between animate-fade-in"
          >
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="remindMeChecked"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
              />
              <label
                for="remember-me"
                class="ml-2 block text-base text-slate-200"
                >Remember me</label
              >
            </div>

            <div class="text-base">
              <a href="#" class="font-medium text-slate-200 hover:text-white"
                >Forgot your password?</a
              >
            </div>
          </div>

          <div>
            <button
              type="submit"
              :class="isButtonEnable ? 'hover:bg-blue-900' : 'bg-blue-300'"
              :disabled="!isButtonEnable"
              class="w-full rounded-md bg-blue-800 py-2 px-4 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
            >
              {{ showLogin ? "Login" : "SignUp" }}
            </button>
          </div>
        </form>

        <div class="flex text-sm text-center justify-center gap-1 pt-4">
          <p class="text-slate-300">
            {{
              showLogin
                ? "Don't have an account?"
                : "Do you already have an account?"
            }}
          </p>
          <button
            class="font-medium text-slate-200 hover:text-white"
            @click="changeView"
          >
            {{ showLogin ? "SignUp" : "Login" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/solid";
import http from "@/http-common";
import logo_light from "@/assets/images/logo_light.svg";

const logo = logo_light;

const router = useRouter();
const route = useRoute();

onMounted( async () => {
  if (route.query.activate) {
    console.log(route.query.activate);
    try {
      const res = await http.post("/activate", { token: route.query.activate });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }
});

const showPass = ref(false);

const remindMeChecked = ref<boolean>();
const showLogin = ref<boolean>(true);
const username = ref<String>("");
const email = ref<String>("");
const password = ref<String>("");
const passwordError = ref<String>("");
const emailError = ref<String>("");

const isValidEmail = computed(() => {
  if (email.value.length) return true;
  emailError.value = "Enter a valid email";
  return false;
});

const isValidPassword = computed(() => {
  if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters long";
    return false;
  } else {
    passwordError.value = "";
    return true;
  }
});

function changeView() {
  showLogin.value = !showLogin.value;
}

const isButtonEnable = computed(() => {
  if (showLogin.value) {
    return isValidEmail.value && isValidPassword.value;
  }
  return (
    isValidEmail.value && isValidPassword.value && username.value.length > 0
  );
});

//TODO: (ADD LOGIC TO LOGIN AND SIGNUP)
async function onSubmitted() {
  if (showLogin.value) {
    const res = await http.post("/login", {
      email: email.value,
      password: password.value,
    });
    res.status == 200 ? router.push("/home") : alert(res.data);
  } else {
    const res = await http.post("/register", { email, password, username });
    res.status === 200 ? changeView() : alert(res.data);
  }
}
</script>

<style scoped>
/* .slide-fade-enter-active {
  transition: all 0.7s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  position: absolute;
  width: 100%;
  transform: translateY(-20px);
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
  position: absolute;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
} */
</style>
