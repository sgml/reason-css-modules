const debug = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const path = require("path");

const loaderPath = path.resolve(__dirname, "../src/loader");
const reOutputPath = path.resolve(__dirname, "style.re");

module.exports = {
  context: path.resolve(__dirname),
  entry: "./app.js",
  resolve: {
    extensions: [".module.scss"]
  },
  module: {
    rules: [
      {
        test: /\.(module\.scss)$/,
        use: [
          {
            loader: path.resolve(__dirname, "./css-loader")
          },
          {
            loader: loaderPath,
            options: {
              extFormat: ".module.scss",
              reOutputPath
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
