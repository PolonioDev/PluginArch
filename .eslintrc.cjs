module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
  },
  extends: 'xo',
  overrides: [
    {
      rules: {
        indent: ['error', 2, {SwitchCase: 1}],
        'comma-dangle': 'off',
        'object-curly-spacing': 'off',
        'linebreak-style': ['error', 'unix']
      },
      files: ['*.{js,cjs}'],
    },
    {
      env: {
        node: true,
      },
      rules: {
        indent: ['error', 2, {SwitchCase: 1}],
        'comma-dangle': 'off',
        'object-curly-spacing': 'off',
        'linebreak-style': ['error', 'unix']
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        SourceType: 'script',
      },
    },
    {
      extends: ['xo-typescript', 'prettier'],
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {selector: 'function', format: ['strictCamelCase'], suffix: ['ID']},
        ],
        '@typescript-eslint/no-dynamic-delete': 'off',
        'no-unused-expressions': 'error',
        'computed-property-spacing': ['error', 'always'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'always'],
        'linebreak-style': ['error', 'unix'],
        '@typescript-eslint/no-for-in-array': 'off',
      },
    },
  ],
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {},
};
