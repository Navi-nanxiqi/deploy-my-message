import antfu from "@antfu/eslint-config";

export default antfu({
    stylistic: {
        indent: 4,
        quotes: "double",
        semi: true,
    },
    typescript: true,
    vue: true,
    react: false,
    svelte: false,
    astro: false,
    solid: false,
    unocss: false,
    test: false,
    ignores: [
        "node_modules",
        "dist",
        "coverage",
        "logs",
        "tmp",
        "documentation",
        ".github",
        "chart",
    ],
    rules: {
        "perfectionist/sort-imports": "off",
        "ts/ban-ts-comment": "off",
        "ts/consistent-type-imports": "off",
        "ts/no-require-imports": "off",
        "style/array-bracket-spacing": "off",
        "node/no-path-concat": "off",
        "no-console": [ "error", {
            allow: [ "log", "warn", "error" ],
        } ],
        "no-template-curly-in-string": "off",
        "ts/no-unsafe-function-type": "off",
        "array-bracket-spacing": [ "error", "always" ],
        "object-curly-spacing": [ "error", "always" ],
        "object-curly-newline": [ "error", {
            multiline: true,
            minProperties: 4,
            consistent: true,
        } ],
    },
});
