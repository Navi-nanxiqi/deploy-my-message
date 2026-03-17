<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCounterStore } from "../stores/counter";
import { useI18n } from "vue-i18n";
import { http } from "../api/index";

const { locale } = useI18n();
const counter = useCounterStore();
const { count } = storeToRefs(counter);
function inc() {
    counter.increment();
}
async function handelTest() {
    const url = "/auth/test";
    console.log(url);
    return await http.get(url).then((response) => {
        return response.data;
    });
}
</script>

<template>
    <div style="padding: 24px">
        <button @click="handelTest">
            Test-Button
        </button>
        <a-typography-title :level="3">
            {{ $t('home.title') }}
        </a-typography-title>
        <a-space>
            <a-button type="primary" @click="inc">
                {{ $t('home.counter') }}: {{ count }}
            </a-button>
        </a-space>
    </div>
    <a-divider />
    <a-space>
        <a-select v-model:value="locale" style="min-width: 160px">
            <a-select-option value="en">
                English
            </a-select-option>
            <a-select-option value="zh-CN">
                简体中文
            </a-select-option>
        </a-select>
    </a-space>
    <a-divider />
</template>
