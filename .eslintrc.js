module.exports = {
  "extends": "airbnb-base",
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": 0,
    "codeFrame": 2
  },
  env: {
    browser: 2,
    node: 2,
    jquery: 2,
  },
  rules: {
    "import/no-unresolved": 0,
    "class-methods-use-this": 0,
    "func-names": 2,
    "function-paren-newline": [2, "consistent",],
    "import/no-extraneous-dependencies": [2],
    "new-cap": 0,
    "no-only-tests/no-only-tests": 0,
    "no-param-reassign": 2,
    "no-underscore-dangle": 0,
    "no-unused-vars": 0,
    "no-use-before-define": 2,
    "require-jsdoc": 0,
    "strict": [0, "never",],
    "vars-on-top": 2,
    "object-curly-newline": 0,
    "no-multi-assign": 0
  },
  globals: {
    document: 0,
    __webpack_public_path__: 2,
  },
  overrides: [
    {
      files: "*.src/**/*.js",
    },
  ],
};