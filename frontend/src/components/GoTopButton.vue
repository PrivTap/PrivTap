<template>
  <div>
    <v-btn fab v-show="show" @click="toTop" >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>

    </div>
<!--  <v-fab-transition>-->
<!--    <div class="text-center ma-4">-->
<!--      <v-btn-->
<!--          fab-->
<!--          elevation="2"-->
<!--          v-show="show"-->
<!--          @click="toTop"-->
<!--          class="rounded-full position-absolute bottom-left"-->
<!--      >-->
<!--        <v-icon>mdi-chevron-up</v-icon>-->
<!--      </v-btn>-->
<!--    </div>-->
<!--  </v-fab-transition>-->
</template>
<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from "vue";

const show = ref(false);
const heightForShow = 20;

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  show.value = !show.value;
}

function onScroll() {
  show.value = window.scrollY > heightForShow;
}

onMounted(async () => {
  window.addEventListener("scroll", onScroll)
})
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll)
})

</script>
<style scoped>
</style>