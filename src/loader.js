const loaderUtils = require("loader-utils");
const path = require("path");

const generate = require("./generate");
const css = require('./css');
const fs = require('fs');

// This is the complete cache storing all known files as a string
const typeDefsCache = {};

// content: string - content of the loaded file
module.exports = function(content) {
  const cb = this.async();
  const options = loaderUtils.getOptions(this);

  // TODO: extract extFormat from the test-query?
  //       probably not possible
  const extFormat = options.extFormat;

  // Relative Path
  const reOutputPath = options.reOutputPath;

  // Both paths need to be absolute
  const rePath = path.resolve(reOutputPath);
  const cssPath = this.resourcePath;

  const cssFileName = path.parse(cssPath).base;

  const classes = css.extractClassNames(content);

  const defData = {
    identifier: generate.calcIdentifierName(cssFileName, extFormat),
    filepath: generate.calcRequireFilepath(rePath, cssPath),
    type: generate.renderObjTypeStr(classes),
  };
  console.log(defData);


  typeDefsCache[cssFileName] = generate.renderExternalDef(defData);

  const styleFileContent = generate.renderStyleFileStr(typeDefsCache);

  //// I don't think this is necessary, since we are writing actual .re files
  const name = options.name
  const url = loaderUtils.interpolateName(this, reOutputPath, { content });

  // this.emitFile(url, styleFileContent);

  console.log(cssPath);

  fs.writeFile(rePath, styleFileContent, 'utf8', (err) => {
    if(err) {
      cb(err);
      return;
    }
    const webpackFilePath = `__webpack_public_path__ + ${JSON.stringify(reOutputPath)};`;
    cb(null, `export default ${webpackFilePath}`);
  });
};
