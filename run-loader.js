const fs = require("fs");
const path = require("path");
const { runLoaders } = require("loader-runner");

runLoaders(
  {
    resource: "./fixture/foo.module.scss",
    context: {
      emitFile: () => {},
      emitError: () => {},
      emitWarning: () => {}
    },
    loaders: [
      {
        loader: path.resolve(__dirname, "./src/loader"),
        options: {
          name: "fixture/demo.[ext]"
        }
      }
    ],
    readResource: fs.readFile.bind(fs)
  },
  (err, result) => (err ? console.error(err) : console.log("Finished"))
);
