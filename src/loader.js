const loaderUtils = require("loader-utils");
const path = require("path");

const generate = require("./generate");
const css = require('./css');

// This is the complete cache storing all known files as a string
const typeDefsCache = {};

// content: string - content of the loaded file
module.exports = function(content) {
  const options = loaderUtils.getOptions(this);
  console.log(options);

  const name = options.name;
  const reOutputPath = path.resolve(options.reOutputPath);
  const cssPath = this.resourcePath;

  const cssFileName = path.parse(cssPath).base;

  const classes = css.extractClassNames(content);

  typeDefsCache[cssFileName] = generate.renderExternalDef({
    identifier: generate.calcIdentifierName(cssFileName),
    filepath: generate.calcRequireFilepath(reOutputPath, cssPath),
    type: generate.renderObjTypeStr(classes),
  });

  console.log(typeDefsCache);

  const styleFileContent = generate.renderStyleFileStr(typeDefsCache);

  console.log(`reOutputPath: ${reOutputPath}`);

  //// I don't think this is necessary, since we are writing actual .re files
  // const name = options.name
  // const url = loaderUtils.interpolateName(this, name, { content });
  this.emitFile(reOutputPath, styleFileContent);

  const webpackFilePath = `__webpack_public_path__ + ${JSON.stringify(reOutputPath)};`;

  return `export default ${webpackFilePath}`;
};
