import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    ignores: ["node_modules/**", "dist/**"], // Escludi cartelle non necessarie
    languageOptions: {
      globals: globals.browser,
      parser: tsParser, // Usa il parser di TypeScript
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // Supporta JSX
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,    // Aggiungi il plugin di TypeScript
      react: pluginReact,                 // Aggiungi il plugin di React
    },
    rules: {
      // Regole base consigliate
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,

      // Regole personalizzate
      "react/react-in-jsx-scope": "off", // Disabilita import React obbligatorio
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn", // Avviso su console.log
    },
    settings: {
      react: {
        version: "detect", // Rileva automaticamente la versione di React
      },
    },
  },
];
