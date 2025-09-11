// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  ignores: ['dist/**', 'bin/**', 'node_modules/**', '*.js', '*.mjs'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
});
