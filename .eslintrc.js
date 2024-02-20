module.exports = {
  extends: ['./node_modules/@easyv/linter/configs/eslint'],
  globals: {
    BASENAME: true,
    VERSION: true,
  },
  rules: {
    'react/destructuring-assignment': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'react-hooks/exhaustive-deps': 1,
    '@typescript-eslint/default-param-last': 0,
    '@typescript-eslint/no-implied-eval': 0,
    'arrow-body-style': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-use-before-define': 0,
    'no-eval': 0,
  },
};
