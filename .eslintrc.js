module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "@vue/airbnb", "@vue/typescript"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    quotes: ["error", "double"],
    "no-await-in-loop": "off",
    "no-plusplus": "off",
    "no-restricted-syntax": "off",
    "lines-between-class-members": "off",
    "import/no-webpack-loader-syntax": "off",
    "comma-dangle": "off",
    "max-len": "off",
  },
  parserOptions: {
    parser: "typescript-eslint-parser",
  },
};
