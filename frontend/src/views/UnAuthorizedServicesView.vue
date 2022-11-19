<template>
  <div>

    <h1 class="text-5xl text-white text-center py-16">Un-Authorised Services</h1>

    <form class="flex items-center mx-auto justify-center py-10">
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
          class="px-64 bg-gray-50 border border-gray-300 text-black text-sm rounded-md block w-full pl-10 p-2.5"
          placeholder="Search"
          
        />  
      </div>
    </form>

    <select
    multiple
    
      class="container mx-auto grid grid-cols-1 bg-gray-800 rounded-md px-5 py-5 border-2 border-blue-600 overflow-y-scroll h-96 overscroll-auto w-full space-y-5">

        <option class="text-white px-4 bg-blue-600 py-5">
          SERVICE 1...
        </option>

        <option class="text-white px-4 bg-blue-600 py-5">
          SERVICE 1...
        </option>

        <option class="text-white px-4 bg-blue-600 py-5">
          SERVICE 1...
        </option>

        <option class="text-white px-4 bg-blue-600 py-5">
          SERVICE 1...
        </option>

        <option class="text-white px-4 bg-blue-600 py-5">
          SERVICE 1...
        </option>

        <option class="text-white px-4 bg-blue-600 py-5">
          SERVICE 1...
        </option>

        <option class="text-white px-4 bg-blue-600 py-5">
          SERVICE 1...
        </option>

    </select>



    <div class="flex flex-row justify-center py-10 space-x-32">
        <button type="button" class="px-16 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-900" @click="isOpen = true">
          Authorize
        </button>
      </div>




  </div>


  <div class="fixed grid h-full place-items-center md:inset-0 h-modal md:h-full" v-if="isOpen">
      <div class="relative w-full max-w-md h-full md:h-auto">


        <div class="relative bg-white
         text-blue-900 rounded-md">



          <div class="flex justify-between items-center p-5 ">

            <button @click="isOpen = false"
              class="text-gray-400 bg-transparent hover:text-blue-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
              data-modal-toggle="small-modal">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>

          <h2 class="text-3xl text-center">Name of service</h2>

          <div class="p-6 space-y-6">

          </div>
       
          <div class="grid place-items-center py-7">
            <button class="px-7 py-2 bg-blue-800 text-white hover:bg-blue-900 rounded-md" @click="isOpen = false">
              Submit
            </button>

          </div>

        </div>

      </div>
    </div>
  




</template>

<script setup lang="ts">
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<style scoped>

</style>