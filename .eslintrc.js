module.exports = {
  parser: "@typescript-eslint/parser", // TypeScript support
  rules: {
    "no-console": "error",
  },
  env: {
    node: true,
  },
  extends: ["plugin:@typescript-eslint/recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module", // Use import syntax in TypeScript
  },
};
