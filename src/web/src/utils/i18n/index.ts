import { createI18n } from "vue-i18n";

export const messages = {
    "en": {
        home: {
            title: "Home",
            counter: "Counter",
            goto: "Go to About",
        },
        about: {
            title: "About",
            back: "Back to Home",
        },
    },
    "zh-CN": {
        home: {
            title: "首页",
            counter: "计数器",
            goto: "前往关于",
        },
        about: {
            title: "关于",
            back: "返回首页",
        },
    },
};

const i18n = createI18n({
    legacy: false,
    locale: "zh-CN",
    fallbackLocale: "en",
    messages,
});

export default i18n;
