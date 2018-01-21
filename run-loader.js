// This file is useful for quickly run the loader

const fs = require("fs");
const path = require("path");
const { runLoaders } = require("loader-runner");

runLoaders(
  {
    resource: "./example/style.module.scss",
    context: {
      emitFile: () => {},
      emitError: () => {},
      emitWarning: () => {}
    },
    loaders: [
      {
        loader: path.resolve(__dirname, "./src/loader"),
        options: {
          extFormat: ".module.scss",
          reOutputPath: "example/style.re"
        }
      }
    ],
    readResource: fs.readFile.bind(fs)
  },
  (err, result) => (err ? console.error(err) : console.log("Finished"))
);
