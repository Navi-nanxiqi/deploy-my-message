import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
    // vite插件运行时候，添加插件 tailwindcss 进行解析样式类
    plugins: [ vue(), tailwindcss() ],
    base: "./",
    server: {
        host: true,
        port: 5173,
        strictPort: true,
    },
    build: {
        outDir: "dist",
        assetsDir: "assets",
        emptyOutDir: false,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
