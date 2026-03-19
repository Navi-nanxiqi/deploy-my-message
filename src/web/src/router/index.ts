import { createRouter, createWebHashHistory } from "vue-router";

import {
    Error,
    Home,
    Login,
    Register,
} from "@/views/index";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/login", name: "login", component: Login },
        { path: "/register", name: "register", component: Register },
        {
            path: "/",
            name: "index",
            component: Home, // Index为布局组件
            children: [
            ],
        },
        { path: "/:pathMatch(.*)*", name: "404", component: Error },
    ],
});

export default router;
