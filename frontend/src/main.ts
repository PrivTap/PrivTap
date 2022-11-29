import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/router";
import "./assets/style.css";
import Toast, { type PluginOptions, POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import piniaPersist from "pinia-plugin-persist";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App);
app.use(ElementPlus)
app.use(pinia);
app.use(router);
const options: PluginOptions = {
  // You can set your default options here
  position: POSITION.TOP_CENTER,
};

app.use(Toast, options);

app.mount("#app");
