import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist', 'node_modules'],

    plugins: {
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },

      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'one-var': ['error', 'never'],

      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],

      'indent': ['error', 2],

      'eqeqeq': ['error', 'always'],
      'no-eq-null': 'error',

      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-unused-vars': 'warn',
      'no-multiple-empty-lines': ['error', { max: 1 }],

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'import/extensions': 'off',
      'import/no-unresolved': 'off',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
