
<template>
  <nav v-if="isAuth" class="flex justify-between pt-5 pl-6">
    <img class="h-24" :src="logo" @click="router.push(RoutingPath.HOME)" />
    <div class="flex pr-10 space-x-5 text-center items-center">
      <button
        class="rounded-lg py-2 px-8 font-semibold text-blue-500 ring-blue-500 ring-[3px] hover:text-blue-400 hover:ring-blue-400"
        @click="router.push(RoutingPath.SERVICES_PAGE)">
        Services
      </button>
      <button class="rounded-lg bg-blue-600 py-2 px-9 text-lg font-medium text-white hover:bg-blue-700"
        @click="router.push(RoutingPath.CREATE_RULE_PAGE)">
        Create
      </button>

      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="#3562E2" size="large">
              <span class="text-h5 text-white">{{
                user?.username.slice(0, 2).toUpperCase()
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="#3562E2">
                <span class="text-h6 text-white">{{
                  user?.username.slice(0, 2).toUpperCase()
                }}</span>
              </v-avatar>
              <h3 class="mt-3">{{ auth_controller.getRef().value?.username }}</h3>
              <p class="text-caption opacity-70">
                {{ user?.email }}
              </p>
              <v-divider class="mt-3"></v-divider>
              <v-btn rounded variant="plain" @click="router.push(RoutingPath.PERSONAL_PAGE)">
                My Rules
              </v-btn>
              <v-divider></v-divider>
              <v-btn rounded variant="plain" @click="router.push(RoutingPath.OSP_PERSONAL_PAGE)">
                OSP Page
              </v-btn>
              <v-divider></v-divider>
              <v-btn class="mt-3" rounded variant="text" color="red" @click="auth_controller.logout()">
                Disconnect
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
  </nav>
</template>

<script setup lang="ts">
import logo from '@/assets/images/logo_dark.svg';
import { useRouter } from 'vue-router';
import RoutingPath from '@/router/routing_path';
import auth_controller from '@/controllers/authorization_controller';
import { onMounted, ref, watch } from 'vue';

const router = useRouter();
let user = auth_controller.getRef();
let isAuth = ref(false);

onMounted(() => {
  isAuth.value = auth_controller.isAuthenticated.value;
});

watch(user, (val) => {
  isAuth.value = auth_controller.isAuthenticated.value;
});


</script>