<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { useRouter } from "vue-router";
import { http } from "./api";
import { onMounted } from "vue";

const router = useRouter();

async function handelSession() {
    const loading = await http.get("/auth/session");
    var data=loading.data.data.data;
    if (data) {
        router.push("/");
    }
    router.push("/login");
}

onMounted(() => {
    handelSession();
});
</script>

<template>
    <Toaster />
    <router-view />
</template>
