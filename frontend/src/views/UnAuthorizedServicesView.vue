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
          class="px-64 bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search"
        />  
      </div>
    </form>

    <select
    
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
        <button type="button" class="px-16 py-3 bg-blue3 text-white">
          Authorize
        </button>
      </div>





  </div>
</template>>
