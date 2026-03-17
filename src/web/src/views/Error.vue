<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeftIcon, HomeIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const router = useRouter();

// 返回首页
function goHome() {
    router.push("/");
}

// 返回上一页
function goBack() {
    router.go(-1);
}
</script>

<template>
    <div class="min-h-screen bg-background flex items-center justify-center px-4">
        <Card class="w-full max-w-md text-center">
            <CardHeader>
                <div
                    class="mx-auto mb-4 w-24 h-24 bg-red-100 dark:bg-red-400/20 border border-border rounded-full flex items-center justify-center"
                >
                    <span class="text-4xl font-bold text-red-600 dark:text-red-400">404</span>
                </div>
                <CardTitle class="text-2xl font-bold text-foreground">
                    页面未找到
                </CardTitle>
                <CardDescription class="text-muted-foreground">
                    抱歉，您访问的页面不存在或已被移除
                </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <p class="text-sm text-muted-foreground">
                    请检查URL是否正确，或者使用下面的按钮返回
                </p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button class="flex items-center gap-2" @click="goHome">
                        <HomeIcon class="w-4 h-4" />
                        返回首页
                    </Button>
                    <Button variant="outline" class="flex items-center gap-2" @click="goBack">
                        <ArrowLeftIcon class="w-4 h-4" />
                        返回上页
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<style scoped>
.card-enter-active,
.card-leave-active {
    transition: all 0.3s ease;
}

.card-enter-from,
.card-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
