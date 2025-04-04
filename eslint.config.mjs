import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import standard from "eslint-plugin-standard";
import _import from "eslint-plugin-import";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/dist/", "**/eslint.config.mjs"]), {
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "standard",
        "eslint-config-airbnb-base",
        "plugin:import/errors",
    )),

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        standard,
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
            ...globals.node,
            ...globals.mocha,
            GLOBAL: true,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    settings: {
        "import/resolver": {
            node: {
                extensions: [".ts", ".d.ts", ".js", ".json"],
            },
        },
    },

    rules: {
        "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
        "no-await-in-loop": 0,
        camelcase: 0,

        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "default",
                format: ["camelCase"],
                leadingUnderscore: "allow",
                trailingUnderscore: "allow",
            },
            {
                selector: "variable",
                format: ["camelCase", "UPPER_CASE"],
                leadingUnderscore: "allow",
                trailingUnderscore: "allow",
            },
            {
                selector: "typeLike",
                format: ["PascalCase"],
            },
            {
                selector: "enumMember",
                format: ["PascalCase", "UPPER_CASE"],
            },
        ],

        "class-methods-use-this": 0,
        "comma-dangle": [2, "always-multiline"],
        curly: [2, "multi-line"],
        "eol-last": [2, "always"],
        "global-require": 1,
        "arrow-parens": 0,
        "implicit-arrow-linebreak": 0,

        "max-len": [2, 120, 2, {
            ignoreUrls: true,
            ignoreComments: false,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }],

        "max-classes-per-file": [2, 5],
        "func-names": 0,
        "function-paren-newline": [2, "multiline-arguments"],
        "no-confusing-arrow": 0,
        "no-prototype-builtins": 0,
        "no-plusplus": 0,

        "no-param-reassign": [2, {
            props: true,
        }],

        "no-underscore-dangle": [1, {
            allowAfterThis: false,
            allowAfterSuper: false,
            enforceInMethodNames: true,
        }],

        "prefer-destructuring": 0,
        "promise/param-names": 0,
        "promise/no-nesting": 0,
        "object-curly-spacing": 0,
        "object-shorthand": [1, "always"],
        "operator-linebreak": 0,

        "object-curly-newline": [2, {
            ObjectExpression: {
                minProperties: 8,
                multiline: true,
                consistent: true,
            },

            ObjectPattern: {
                minProperties: 8,
                multiline: true,
                consistent: true,
            },

            ImportDeclaration: {
                minProperties: 8,
                multiline: true,
                consistent: true,
            },

            ExportDeclaration: {
                minProperties: 8,
                multiline: true,
                consistent: true,
            },
        }],

        quotes: [2, "single", {
            allowTemplateLiterals: true,
        }],

        semi: [2, "always"],

        "@typescript-eslint/array-type": [2, {
            default: "array-simple",
        }],

        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-inferrable-types": 0,
        "@typescript-eslint/no-var-requires": 1,

        "import/extensions": [2, "always", {
            js: "never",
            ts: "never",
        }],

        "import/first": 0,
        "import/prefer-default-export": 0,

        "import/no-unassigned-import": [2, {
            allow: [
                "**/*.css",
                "**/*.less",
                "**/*.html",
                "core-js/**",
                "regenerator-runtime/**",
                "**/polyfills*",
            ],
        }],

        "import/no-named-as-default": 0,
        "import/no-deprecated": 2,
        indent: ["error", 2],
        "no-unused-expressions": 0,
        "prefer-arrow-callback": 0,

        "@typescript-eslint/no-use-before-define": ["error", {
            variables: false,
            typedefs: false,
            functions: false,
            classes: false,
        }],

        "no-use-before-define": ["error", {
            variables: true,
            functions: false,
            classes: false,
        }],
    },
}]);
