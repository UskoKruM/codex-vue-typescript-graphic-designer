import pluginVue from "eslint-plugin-vue";
import { globalIgnores } from "eslint/config";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVitest from "@vitest/eslint-plugin";

export default defineConfigWithVueTs(
    {
        name: "app/files-to-lint",
        files: ["**/*.{ts,mts,tsx,vue}"]
    },

    globalIgnores(["**/coverage/**", "**/dist/**", "**/dist-ssr/**", "**/doc/**", "node_modules/**"]),

    pluginVue.configs["flat/strongly-recommended"],
    vueTsConfigs.recommendedTypeChecked,

    {
        ...pluginVitest.configs.recommended,
        files: ["tests/**/*.{spec,test}.{ts,js}", "tests/**/*.ts"]
    },
    {
        files: ["**/*.d.ts"],
        rules: {
            "@typescript-eslint/no-empty-object-type": ["error", { allowInterfaces: "with-single-extends" }]
        }
    },
    {
        languageOptions: {
            ecmaVersion: "latest",
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            },
            sourceType: "module"
        },
        rules: {
            "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "inline-type-imports" }],
            "@typescript-eslint/no-redeclare": "error",
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/no-use-before-define": ["error", { classes: true, functions: false, variables: true }],
            "@typescript-eslint/require-await": "warn",
            "@typescript-eslint/return-await": ["error", "in-try-catch"],
            "array-callback-return": "error",
            "consistent-return": "warn",
            curly: ["error", "all"],
            "default-case": "warn",
            "default-case-last": "error",
            "eol-last": ["error", "always"],
            eqeqeq: ["error", "always", { null: "ignore" }],
            "object-curly-spacing": ["error", "always"],
            "object-shorthand": ["error", "always"],
            "no-alert": "warn",
            "no-async-promise-executor": "error",
            "no-await-in-loop": "warn",
            "no-console": ["warn", { allow: ["error", "warn"] }],
            "no-constant-condition": ["error", { checkLoops: false }],
            "no-debugger": "warn",
            "no-dupe-else-if": "error",
            "no-dupe-keys": "error",
            "no-duplicate-case": "error",
            "no-empty": ["error", { allowEmptyCatch: false }],
            "no-ex-assign": "error",
            "no-eval": "error",
            "no-fallthrough": "error",
            "no-global-assign": "error",
            "no-implicit-globals": "error",
            "no-invalid-regexp": "error",
            "no-lonely-if": "warn",
            "no-multi-spaces": "error",
            "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
            "no-new-func": "error",
            "no-param-reassign": "warn",
            "no-promise-executor-return": "error",
            "no-prototype-builtins": "error",
            "no-self-compare": "error",
            "no-unreachable": "error",
            "no-unreachable-loop": "error",
            "no-unsafe-finally": "error",
            "no-unsafe-negation": "error",
            "no-unsafe-optional-chaining": "error",
            "no-useless-catch": "error",
            "no-useless-escape": "error",
            "no-useless-return": "error",
            "no-var": "error",
            "no-with": "error",
            "prefer-const": ["error", { destructuring: "all" }],
            "prefer-template": "error",
            "vue/attribute-hyphenation": "off",
            "vue/block-order": ["error", { order: ["script", "template", "style"] }],
            "vue/component-api-style": ["error", ["script-setup"]],
            "vue/component-name-in-template-casing": ["error", "PascalCase"],
            "vue/define-emits-declaration": ["error", "type-based"],
            "vue/define-macros-order": [
                "error",
                {
                    defineExposeLast: true,
                    order: ["defineOptions", "defineProps", "defineEmits", "defineModel"]
                }
            ],
            "vue/define-props-declaration": ["error", "type-based"],
            "vue/html-content-newline": "off",
            "vue/html-indent": ["warn", 4],
            "vue/html-self-closing": "off",
            "vue/max-attributes-per-line": "off",
            "vue/no-v-html": "warn",
            "vue/singleline-html-element-content-newline": "off"
        }
    }
);
