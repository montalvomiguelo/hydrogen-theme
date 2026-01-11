// @ts-check

import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['assets/']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  js.configs.recommended,
  eslintConfigPrettier
]
