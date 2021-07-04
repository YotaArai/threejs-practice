const path = require("path");
module.exports = {
  mode: process.env.WEBPACK_ENV,
  entry: {
    test: "/src/test",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/main.js"
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
  }
};