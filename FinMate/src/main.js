import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "./styles/fonts.css";
import "@/styles/colors.css";

const app = createApp(App);
app.use(router);
const pinia = createPinia();
app.use(pinia);
app.mount("#app");
