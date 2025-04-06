// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["eslint:recommended", "plugin:react/recommended", "prettier"],
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
