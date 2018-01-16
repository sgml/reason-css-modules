const { parse } = require("scss-parser");
const createQueryWrapper = require("query-ast");

const extractClassNames = content => {
  const ast = parse(content);
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

module.exports = {
  extractClassNames
};
