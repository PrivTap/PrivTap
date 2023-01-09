<template>
 

 <div class="h-full">

<div class="flex flex-col items-center justify-center relative h-full">
<img :src="radial" class="w-1/2">
<div class="absolute top-2 w-full h-5/6">
  <h1 class="text-5xl text-blue-100 text-center pb-12 font-medium">
     My Rules
  </h1>

  <div v-if="!rules.length && !isLoading" class="flex flex-col justify-center items-center content-center ">
    <h1 class="text-3xl text-blue-100 text-center pt-8 font-medium">
     You have not created any rules yet
    </h1>
    <h1 class="text-lg text-stone-400 text-center pt-4 pb-10 font-medium">
      Create a rule by clicking a button below
    </h1>
    <img :src=empty class="h-72 ">
  </div>


  <div v-if="isLoading" class="flex flex-col justify-center items-center content-center ">
    <img :src="logo" class="h-32 my-20 animate-bounce">
  </div>

  <div class="flex flex-col justify-center items-center content-center">
    <PrimaryButton :onClick="() => router.push(RoutingPath.CREATE_RULE_PAGE)" text="Create New Rule"
      class="min-w-fit" />
  </div>

  <div v-if="rules?.length && !isLoading"  class="py-10">
   <div class="flex justify-center items-center mt-20 gap-10">
      <RuleCard v-for="(item, index) in rules" :key="index" :rule="item" />
    </div>
  </div>
</div>
</div>




</div>








</template>

<script setup lang="ts">

import {inject, onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import router from '@/router/router';
import RoutingPath from "@/router/routing_path";
import radial from '@/assets/images/radial.svg';
import logo from '@/assets/images/logo_dark.svg';
import rules_controller from '@/controllers/rules_controller';
import empty from '@/assets/images/empty.svg';
import RuleCard from '@/components/RuleCard.vue';
import PrimaryButton from '@/components/PrimaryButton.vue';


const dialog = ref(false);
const isLoading = ref(true);

let rules = rules_controller.getRef();

const route = useRoute();


async function onClose() {
  dialog.value = false
}

onMounted(async() => {
  await rules_controller.getAllRules();
  isLoading.value = true;
  isLoading.value = false;
})

</script>

<style scoped>

</style>