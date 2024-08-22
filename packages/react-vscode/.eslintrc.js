require('@kbjdev/eslint-config/patch');
module.exports = {
  settings: {
    react: {
      version: '18.3.1',
    },
  },
  extends: ['@kbjdev/eslint-config', '@kbjdev/eslint-config/mixins/react'],
  parserOptions: { project: true, tsconfigRootDir: __dirname },
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
  },
};
