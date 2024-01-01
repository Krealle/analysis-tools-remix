/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "jsx-a11y", "@typescript-eslint", "import"],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      version: "detect",
    },
    formComponents: ["Form"],
    linkComponents: [
      { name: "Link", linkAttribute: "to" },
      { name: "NavLink", linkAttribute: "to" },
    ],
    node: {
      resolvePaths: ["node_modules/@types"],
      tryExtensions: [".js", ".json", ".node", ".ts", ".d.ts", ".tsx"],
    },
    "import/internal-regex": "^~/",
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
      },
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  ignorePatterns: ["*.cjs"],

  rules: {
    eqeqeq: ["error", "always"],
    "no-plusplus": "error",
    "one-var": [
      "error",
      {
        initialized: "never",
      },
    ],
    "no-implicit-coercion": "error",

    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-unsafe-enum-comparison": "warn",

    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/await-thenable": "error",

    "react/jsx-curly-brace-presence": [
      "warn",
      { props: "never", children: "never" },
    ],
    "react/jsx-boolean-value": ["warn", "never"],
  },

  overrides: [
    {
      /** Functions in ZustandStore return void, no need to type assert  */
      files: ["./app/zustand/*.ts"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
  ],
};
