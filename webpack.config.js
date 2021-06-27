module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    path: `${__dirname}/dist`,
    filename: "main.js"
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