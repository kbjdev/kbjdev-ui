module.exports = {
  extends: [
    '@rushstack/eslint-config/profile/web-app',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    '@rushstack/no-new-null': 'off',
    '@rushstack/typedef-var': 'off',
    '@typescript-eslint/typedef': [
      'warn',
      {
        arrayDestructuring: false,
        arrowParameter: false,
        memberVariableDeclaration: true,
        objectDestructuring: false,
        parameter: false,
        propertyDeclaration: true,
        variableDeclaration: false,
        variableDeclarationIgnoreFunction: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/parameter-properties': [
      'warn',
      {
        allow: ['private readonly', 'public readonly'],
      },
    ],
    'import/no-named-as-default': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
