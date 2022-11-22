<template>
  <div>
    <h1 class="text-5xl text-blue-100 font-medium text-center py-5">Services</h1>

    <form class="flex items-center mx-auto justify-center py-20">
      <label for="simple-search" class="sr-only">Search</label>

      <div class="relative">
        <div
          class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
        >
          <svg
            aria-hidden="true"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          class="px-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search"
          >
      </div>
      
    </form>

    <div
      class="container mx-auto grid grid-cols-1 bg-gray-800 px-5 py-5 border-2 border-blue-600 gap-4 overflow-y-scroll h-96 overscroll-auto"
    >
      <div class="text-white px-4 bg-blue-600 w-full py-5 rounded-md hover:bg-blue-900">
        SERVICE 1...
        <button class="float-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.0"
            stroke="white"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600 w-full py-5 rounded-md hover:bg-blue-900">
        SERVICE 2...
        <button class="float-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.0"
            stroke="white"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600 w-full py-5 rounded-md hover:bg-blue-900">
        SERVICE 3...
        <button class="float-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.0"
            stroke="white"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600 w-full py-5 rounded-md hover:bg-blue-900">
        SERVICE 4...
        <button class="float-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.0"
            stroke="white"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600 w-full py-5 rounded-md hover:bg-blue-900">
        SERVICE 5...
        <button class="float-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.0"
            stroke="white"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600 w-full py-5 rounded-md hover:bg-blue-900">
        SERVICE 6...
        <button class="float-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2.0   "
            stroke="white"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex flex-row justify-center py-10 space-x-20">
      <button type="button" class="px-5 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-900" @click="router.push('/modifyauth')"> 
        Modify authorization
      </button>
      <button type="button" class="px-5 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-900" @click="router.push('/unauthorizedservices')">
        Authorize new service
      </button>
    </div>
  </div>
  
</template>




<script setup lang="ts">
import { useAuthStore } from "../stores/auth_store";
import { useRouter } from "vue-router";
const authStore = useAuthStore();
const router = useRouter();


</script>
<style scoped></style>