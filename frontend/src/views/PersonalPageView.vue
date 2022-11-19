

<template>
    <!-- <link rel="stylesheet" href="/dist/output.css" />

    <title>Persnal Page</title> -->
  <div class="text-center py-20" >
    <div class="text-4xl text-white font-semibold pb-10">
      <a>Personal Page</a>
    </div>

    <div
      class="container mx-auto grid grid-cols-1 bg-gray-800 rounded-lg px-5 py-5 border-2 border-blue-600 gap-4 overflow-y-scroll h-96 overscroll-auto">
      <div class="text-white px-4 bg-blue-600 w-full py-5 rounded-md">
        RULE 1
        <button class="float-right">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="white"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600 w-full py-5 rounded-md">
        RULE 2
        <button class="float-right">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="white"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600  w-full py-5 rounded-md">
        RULE 3
        <button class="float-right">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="white"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600  w-full py-5 rounded-md">
        RULE 4
        <button class="float-right">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="white"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600  w-full py-5 rounded-md">
        RULE 5
        <button class="float-right">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="white"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      <div class="text-white px-4 bg-blue-600  w-full py-5 rounded-md">
        RULE 6
        <button class="float-right">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0   " stroke="white"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex flex-row justify-center py-10 space-x-32">
      <button type="button" @click="isOpen = true"
        class="px-5 py-3 bg-blue-800 text-white hover:bg-blue-900 rounded-md">
        Add new rules
      </button>




      <button type="button" class="px-5 py-3 bg-blue-800 text-white hover:bg-blue-900 rounded-md">
        See authorized devices
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

          <h2 class="text-3xl text-center">Add rule</h2>

          <div class="p-6 space-y-6">

          </div>
          <form>

            <div class="mb-6 mx-auto w-96">
              <label for="text" class="block mb-2">IF...</label>
              <input type="text" id="text"
                class= "bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5"
                placeholder="...">
            </div>


            <div class="mb-6 mx-auto w-96">
              <label for="text" class="block mb-2">THEN...</label>
              <input type="text" id="text"
                class="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg block w-full p-2.5"
                placeholder="...">
            </div>


          </form>
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