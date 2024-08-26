require('@kbjdev/eslint-config/patch');
module.exports = {
  extends: [
    '@kbjdev/eslint-config',
    '@kbjdev/eslint-config/mixins/react',
    'plugin:storybook/recommended',
  ],
  parserOptions: { project: true, tsconfigRootDir: __dirname },
  settings: {
    react: {
      version: '18.3.1',
    },
  },
  rules: {
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc' },
        pathGroups: [{ pattern: 'react', group: 'external', position: 'before' }],
        pathGroupsExcludedImportTypes: ['react'],
        groups: ['builtin', 'external', 'internal', 'sibling', 'parent', 'index', 'type'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none',
        caughtErrors: 'none',
        varsIgnorePattern: 'React',
      },
    ],
  },
};
