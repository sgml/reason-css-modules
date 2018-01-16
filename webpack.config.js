const debug = process.env.NODE_ENV !== "production";
const webpack = require("webpack");
const path = require("path");

module.exports = {
  context: __dirname,
  entry: "./test/app.js",
  module: {
    rules: [
      {
        test: /\.(module\.scss)$/,
        use: [
          {
            loader: path.resolve(__dirname, "./src/loader"),
            options: {
              extFormat: ".module.scss",
              reOutputPath: "build/Style.re",
              name: "fixture/[name].[ext]"
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
