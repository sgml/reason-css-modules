const loaderUtils = require("loader-utils");

const { parse, stringify } = require("scss-parser");
const createQueryWrapper = require("query-ast");

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

const writeReFile = (name, classes) => {
  let result = `type s${name} = {\n  .`;
  let first = true;
  for (let cl in classes) {
    result += first ? "\n" : ",\n";
    first = false;
    result += `  "${cl}": string`;
  }
  result += "\n};";
  return result;
};


// content = content of the loaded file
module.exports = function(content) {
  const { name } = loaderUtils.getOptions(this);

  const ast = parse(content);
  const classNames = extractClassNames(ast);
  console.log(classNames);

  const foo = writeReFile('foo', classNames);
  console.log(foo);

  const url = loaderUtils.interpolateName(this, name, { content });

  this.emitFile(url, content);

  const path = `__webpack_public_path__ + ${JSON.stringify(url)};`;

  return `export default ${path}`;
};
