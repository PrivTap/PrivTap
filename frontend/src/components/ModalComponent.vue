<template>
  <div>
    <div
      class="h-full w-full fixed top-0 left-0 z-20 bg-black bg-opacity-20"
      @click="onPressed(null)"
    ></div>
    <div
      class="bg-white rounded-lg text-lg pt-6 shadow-lg w-96 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
    >
      <div class="px-6 pb-6 text-center">
        <h3 class="text-xl mb-2 font-semibold">{{ title }}</h3>
        <p class="text-gray-600 font-light">
          {{ subTitle }}
        </p>
      </div>
      <li
        class="border-b text-blue-500 border-gray-100 w-full px-6 py-3 hover:bg-gray-100"
        @click="onPressed(true)"
      >
        Continue
      </li>
      <li
        class="w-full text-red-500 px-6 py-3 rounded-b-lg hover:bg-gray-100"
        @click="onPressed(false)"
      >
        Cancel
      </li>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    default: "",
  },
  onPressed: {
    type: Function,
    required: true,
  },
});
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s ease-out both;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse ease-in both;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
