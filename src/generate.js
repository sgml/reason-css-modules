/*
  GOAL -> Taking an array of classnames & filename
          and generate a BS declaration like this:

    [@bs.module] external style : {."root": string} = "./style.module.scss";

    more formal with parameters (indicated with leading $):
    [@bs.module] external $identifier: $type = "$filepath";
*/

const packageName = require("../package").name;
const HEADER = `/**
* GENERATED VIA ${packageName}
* ---
* Do not modify this file manually.
* Edit the relevant scss file instead!
**/
`;

const sortObjectKeys = obj =>
  Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

const renderExternalDef = ({
  identifier = "%identifier",
  filepath = "%filepath",
  type = "%type"
}) => `[@bs.module] external ${identifier} : ${type} = "${filepath}"`;

const renderTypeField = f => `"${f}": string`;

const renderTypeFields = fields =>
  fields.reduce((acc, f) => {
    if (acc === "") {
      return renderTypeField(f);
    } else {
      return `${acc},\n${renderTypeField(f)}`;
    }
  }, "");

const renderObjTypeStr = classes => {
  const typeFields = renderTypeFields(classes);
  if (typeFields == "") {
    return "{.}";
  }
  return `{.\n${typeFields}\n}`;
};

// files : { [fname: string]: string }
const renderStyleFileStr = files => {
  let result = "";
  let sorted = sortObjectKeys(files);

  const content = Object.entries(sorted).reduce((acc, [key, value]) => {
    if (acc === "") {
      return value;
    }
    return `${acc}\n${value}`;
  }, "");

  return `${HEADER}${content !== "" ? `\n${content}` : ""}`;
};

module.exports = {
  renderTypeFields,
  renderObjTypeStr,
  renderStyleFileStr,
  renderExternalDef
};
