module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:solid/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['solid'],
  rules: {
    // 'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/ban-ts-comment': 0,
  },
}
