module.exports = {
  extends: "airbnb-base",
  parser: "babel-eslint",
  rules: {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "arrow-body-style": false,
    "arrow-parens": false,
    "import/prefer-default-export": false,
    "react/jsx-one-expression-per-line": false,
    "react/destructuring-assignment": false,
    "react/prop-types": false,
    "react/prefer-stateless-function": false,
    "react/no-unused-state": false,
    "no-console": false,
    "comma-dangle": false,
    "class-methods-use-this": false,
    "object-curly-newline": false
  },
  globals: {
    "window": true,
    "document": true
  }
};
