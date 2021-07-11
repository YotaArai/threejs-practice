const path = require("path");
const enabledSourceMap = process.env.WEBPACK_ENV === "development";
module.exports = {
  mode: process.env.WEBPACK_ENV,
  entry: {
    test: "/src/test",
    holographic_intaractions: "/src/holographic_intaractions"
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "docs"),
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
              url: false,
              sourceMap: enabledSourceMap,
            }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: enabledSourceMap,
              postcssOptions: {
                plugins: [
                  ["autoprefixer", { grid: true }],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: enabledSourceMap,
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"],
  }
};