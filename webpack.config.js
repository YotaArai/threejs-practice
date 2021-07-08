const path = require("path");
module.exports = {
  mode: process.env.WEBPACK_ENV,
  entry: {
    test: "/src/test",
    holographic_intaractions: "/src/holographic_intaractions"
  },
  devtool: "source-map",
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
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js", ".sass", ".scss", ".css"],
  }
};