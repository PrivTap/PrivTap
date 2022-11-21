
<template>
    <div>
      <h1 class="text-5xl text-white text-center py-12">Services</h1>
  
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
            class="px-64 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search"
            >
        </div>
        
      </form>
  
      <div class="container mx-auto bg-gray-800 gap-4 rounded-md px-5 py-5 border-2 border-blue-600 overflow-y-scroll h-96 overscroll-auto">


        <div class="space-y-5">
        <div v-for="item,index in form" :key="item" class="text-white px-4 py-8 h-10 bg-blue-600 w-full">


        <div class="align-super">
        SERVICE {{ index+1 }}
        </div>    
          <!-- <button class="float-right">
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
          </button> -->
          <!-- <button type="button" class="btn btn-danger btn-sm" @click="removeRow(index)">x</button>&nbsp;
          <button type="button" class="btn btn-success btn-sm" @click="addRow">+</button> -->
        </div>
      </div>
    </div>


  
      <div class="flex flex-row justify-center py-10 space-x-20">
        <button type="button" class="px-5 py-3 bg-blue-800 text-white">
          Modify authorization
        </button>
        <button type="button" class="px-5 py-3 bg-blue-800 text-white">
          Authorize new service
        </button>
      </div>
    </div>
    
  </template>
  
  

  <script>
  import { reactive } from 'vue'
  import axios from 'axios'
  export default {
    name: 'HelloWorld',
    setup(){
      const form = reactive([
        { name : '', price: 0}
      ])

  
      const removeRow = (index) =>{
        if(form.length > 1){
          form.splice(index,1)
        }
      }
  

      const addRow = () => {
      form.push({ name : '', price: 0})
      }



    //   const saveItem = () =>{
    //     // axios
    //     axios.post('items',form).then(res=>{
    //       console.log(res);
    //     })
    //   }
  
      return{
        form,
        addRow,
        // saveItem,
        removeRow
      }
    }
  }
  </script>




  
  
<!-- <script type lang="ts">
@import { reactive } from 'vue'
export default {
const form = reactive ([
])


}
const removeRow = (index) => {
form.splice(index,1)
}

return {
    form,
    removeRow
}
  </script>
  <style scoped></style>  -->




<!-- COMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM -->




  <!-- <template>
    <div class="container mt-4 bg-white">   
     <div class="card">
       <div class="card-body">


        <div  v-for="item,index in form" :key="item">
            <h3>Item {{ index+1 }}</h3>


           <div class="row">
             <div class="col-sm-5">
               <label>Name</label>
               <input type="text" class="form-control" v-model="item.name">
             </div>
             <div class="col-sm-5">
               <label>Price</label>
               <input type="number" class="form-control" v-model="item.price">
             </div>
             <div class="col-sm-2 pt-4">
               <button type="button" class="btn btn-danger btn-sm" @click="removeRow(index)">x</button>&nbsp;
               <button type="button" class="btn btn-success btn-sm" @click="addRow">+</button>
             </div>
           </div>
  
          
        </div> -->
           <!-- <button type="button" class="btn btn-success mt-3" @click="saveItem">Save</button> -->
       <!-- </div>
     </div>
    </div>
  </template> -->
  
  <!-- <script>
  import { reactive } from 'vue'
  import axios from 'axios'
  export default {
    name: 'HelloWorld',
    setup(){
      const form = reactive([
        { name : '', price: 0}
      ])

  
      const removeRow = (index) =>{
        if(form.length > 1){
          form.splice(index,1)
        }
      }
  

      const addRow = () => {
      form.push({ name : '', price: 0})
      }



    //   const saveItem = () =>{
    //     // axios
    //     axios.post('items',form).then(res=>{
    //       console.log(res);
    //     })
    //   }
  
      return{
        form,
        addRow,
        // saveItem,
        removeRow
      }
    }
  }
  </script> -->