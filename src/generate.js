/*
  GOAL -> Taking an array of classnames & filename
          and generate a BS declaration like this:

    [@bs.module] external style : {."root": string} = "./style.module.scss";

    more formal with parameters (indicated with leading $):
    [@bs.module] external $identifier: $type = "$filepath";
*/

const path = require("path");
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

// This will calculate the filepath for the external definition
// The import path of given JS file is dependent on the actual position
// of the reOutputFile

// reOutputPath: string - Target .re file containing the external definition
// cssPath: string - The SCSS file being processed in the process
const calcRequireFilepath = (reOutputPath, cssPath) => {
  const re = path.parse(reOutputPath);
  const css = path.parse(cssPath);
  const rel = path.relative(re.dir, css.dir);

  if (!rel.startsWith(".")) {
    return `./${rel}/${css.base}`;
  }

  return `${rel}/${css.base}`;
};

const ocamlifyOps = [
  str => str.replace(/[\-\.]/g, "_"),
  str => str.charAt(0).toLowerCase() + str.slice(1)
];

// Disambiguates character problems for OCaml
// and hey, this reduce is actually fn composition, now you learned stuff!
const ocamlify = str => ocamlifyOps.reduce((acc, next) => next(acc), str);

// This should create an identifier which follows the
// OCaml requirements and which also sounds like the
// original css file

// cssFileName: string - Filename (without path)
// extFormat: string - The extension format chosen by the user (e.g. '.module.scss')
const calcIdentifierName = (cssFileName, extFormat) => {
  const withoutExt =
    extFormat == null
      ? path.parse(cssFileName).name
      : cssFileName.split(`${extFormat}`)[0];

  return ocamlify(withoutExt);
};

module.exports = {
  renderTypeFields,
  renderObjTypeStr,
  renderStyleFileStr,
  renderExternalDef,
  calcRequireFilepath,
  calcIdentifierName,
  ocamlify
};
