/* This file offers JS compatible functions */
let renderCssBindings =
    (
      obj: {
        .
        "classes": array(string),
        "rePath": string,
        "cssPath": string,
        "extFormat": string
      }
    ) => {
  let classes = obj##classes;
  let rePath = obj##rePath;
  let cssPath = obj##cssPath;
  let extFormat = obj##extFormat;
  Gen.reCssBindings(~classes, ~rePath, ~cssPath, ~extFormat, ());
};

let renderStyleFile = (obj: Js.Dict.t(string)) =>
  Gen.styleFile(Js.Dict.entries(obj));
