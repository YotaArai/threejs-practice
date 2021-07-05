const path = require("path");
module.exports = {
  mode: process.env.WEBPACK_ENV,
  entry: {
    test: "/src/test",
    holographic_intaractions: "/src/holographic_intaractions"
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
      },
      {
        test: /(\.s[ac]ss)$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader" 
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".sass", ".scss", ".css"],
  }
};