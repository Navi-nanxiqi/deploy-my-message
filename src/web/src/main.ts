import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "ant-design-vue/dist/reset.css";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import router from "@/router";
import i18n from "@/utils/i18n";

const app = createApp(App);

app.use(Antd);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount("#app");
