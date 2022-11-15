import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router/router";

import "./assets/style.css";
import dotenv from "dotenv";

import Toast, { type PluginOptions, POSITION } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
const options: PluginOptions = {
  // You can set your default options here
  position: POSITION.TOP_CENTER,
};

app.use(Toast, options);

app.mount("#app");
