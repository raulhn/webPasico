// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    "expo",
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  plugins: ["prettier"],
  ignorePatterns: ["autoHeightWebView/index.js"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
