<template>

<div>
    <h1 class="text-5xl text-blue-100 font-medium text-center py-20">Publish Service</h1>




    
<form>

    <div class="mb-6 mx-auto w-96">
      <label for="text" class="block mb-2 text-sm font-semibold text-white dark:text-gray-300">Name</label>
      <input type="text" id="text" class="bg-gray-50 border border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700" placeholder="...">  
      <!-- Required as a command is missing in above input -->
    </div>


    <div class="mb-6 mx-auto w-96">
        <label for="text" class="block mb-2 text-sm font-semibold text-white dark:text-gray-300">Description</label>
        <input type="text" id="text" class="bg-gray-50 border border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700" placeholder="...">
      </div>


      <div class="mb-6 mx-auto w-96">
        <label for="text" class="block mb-2 text-sm font-semibold text-white dark:text-gray-300">Required data</label>
        <input type="text" id="text" class="bg-gray-50 border border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700" placeholder="...">
      </div>


      <div class="mb-6 mx-auto w-96">
        <label for="text" class="block mb-2 text-sm font-semibold text-white dark:text-gray-300">Endpoint link</label>
        <input type="text" id="text" class="bg-gray-50 border border-gray-600 text-white text-md rounded-lg block w-full p-2.5 dark:bg-gray-700" placeholder="...">
      </div>

</form>
  

<div class="flex flex-row justify-center py-10 space-x-32">
    <button type="button" class="px-16 py-3 bg-blue-800 rounded-md text-white font-semibold">
      Create API endpoint
    </button>
  </div>

</div>
</template>>


<script setup lang="ts">

/// Scripts

</script>

<style scoped>

</style>