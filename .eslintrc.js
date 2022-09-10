module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'next',
    'next/core-web-vitals',
    'airbnb',
    'plugin:cypress/recommended',
    'plugin:react/recommended',
  ],
  ignorePatterns: [
    'public/*.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'cypress',
  ],
  root: true,
  rules: {
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error', {
        argsIgnorePattern: '_',
        varsIgnorePattern: '_',
      },
    ],
    '@typescript-eslint/no-redeclare': ['error'],
    '@typescript-eslint/no-use-before-define': ['error', { classes: false, functions: false }],
    'import/extensions': ['error', { json: 'always', tsx: 'never' }],
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-is-valid': ['error', {
      components: ['Link'],
      specialLink: ['hrefLeft', 'hrefRight'],
      aspects: ['invalidHref', 'preferButton'],
    }],
    'jsx-a11y/no-autofocus': ['off'],
    'max-len': ['error', 140, {
      ignoreStrings: true,
    }],
    'no-redeclare': 0,
    'no-undef': 0,
    'no-unused-expressions': 0,
    'no-use-before-define': 0,
    'object-curly-newline': ['error', {
      consistent: true,
    }],
    radix: 0,
    'react/display-name': 'off',
    /* TODO : Check react-hooks/exhaustive-deps rule */
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.tsx'] }],
    'react/jsx-props-no-spreading': 0,
    'react/jsx-sort-props': [2, { reservedFirst: false }],
    'react/require-default-props': 0,
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
