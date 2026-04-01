import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import-x";
import globals from "globals";

export default tseslint.config(
  { ignores: ["**/dist/", "**/eslint.config.mjs"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
    },

    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, "off"])),
        ...globals.node,
        ...globals.mocha,
        GLOBAL: true,
      },

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
      "@typescript-eslint/no-require-imports": 1,

      // Disable import/no-unresolved and import/extensions for TypeScript - TypeScript compiler
      // handles module resolution and validates imports with NodeNext module resolution
      // (including .js extensions for ESM)
      "import/no-unresolved": 0,
      "import/extensions": 0,

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
  },
);
