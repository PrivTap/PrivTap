<template>
 








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

  console.log(inject("setTriggerId"));
  console.log(inject("triggerId"));
})

</script>

<style scoped>

</style>