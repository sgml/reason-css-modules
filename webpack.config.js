const debug = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const path = require("path");

module.exports = {
  context: path.resolve(__dirname),
  entry: "./test/app.js",
  resolve: {
    extensions: [".module.scss"]
  },
  module: {
    rules: [
      {
        test: /\.(module\.scss)$/,
        use: [
          {
            loader: path.resolve(__dirname, "./src/loader"),
            options: {
              extFormat: ".module.scss",
              reOutputPath: "test/Style.re",
              name: "fixture/Style.re"
            }
          }
        ]
      }
    ]
  },
  output: {
    path: __dirname + "/build",
    filename: "scripts.min.js"
  }
};
