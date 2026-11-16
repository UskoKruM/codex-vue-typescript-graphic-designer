import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "animate.css";
import "@/styles/main.css";
import App from "@/App.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [{ component: { template: "<div />" }, path: "/" }]
});

createApp(App).use(router).mount("#app");
