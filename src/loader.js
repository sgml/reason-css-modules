const loaderUtils = require("loader-utils");

const path = require("path");

const {
  renderTypeFields,
  renderTypeStr,
  renderStyleFileStr
} = require("./restuff");
const { parse, stringify } = require("scss-parser");
const createQueryWrapper = require("query-ast");

// TODO: make this configurable
const STYLE_FILE_PATH = path.resolve(__dirname, "src", "Styles.re");

// This is the complete cache storing all known files as a string
const typeDefsCache = {};

const sortObjectKeys = obj =>
  Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

const extractClassNames = ast => {
  const $ = createQueryWrapper(ast);

  return $("rule")
    .map(n => {
      if (n.node.value[0].type === "selector") {
        // Check if the selector is actually of type class
        // effectively ignoring IDs and such
        const v = n.node.value[0].value[0];

        if (v.type === "class") {
          const name = v.value[0].value;
          return name;
        }
      }
    })
    .filter(name => name != null);
};

// content = content of the loaded file
module.exports = function(content) {
  const { name } = loaderUtils.getOptions(this);
  const url = loaderUtils.interpolateName(this, name, { content });
  const filename = path.parse(this.resourcePath).name;

  const ast = parse(content);
  const classes = extractClassNames(ast);

  const foo = renderTypeStr("foo", classes);
  console.log(foo);
  console.log(renderTypeFields(classes));

  typeDefsCache[filename] = renderTypeStr(filename, classes);
  console.log(renderStyleFileStr(typeDefsCache));

  this.emitFile(url, content);

  const webpackFilePath = `__webpack_public_path__ + ${JSON.stringify(url)};`;

  return `export default ${webpackFilePath}`;
};
