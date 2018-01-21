[@bs.module "../../../package.json"] external name : string = "";

[@bs.module "../../../package.json"] external version : string = "";

let header = {j|/**
* GENERATED VIA $name ($version)
* ---
* Do not modify this file manually.
* Edit the relevant scss file instead!
**/
|j};

/* renderExternalDef */
let externalDef =
    (~identifier="%identifier", ~filepath="%filepath", ~type_="%type", ()) => {j|let $identifier : $type_ = [%raw {|require("$filepath")|}];|j};

/* renderTypeField */
let objTypeField = (f: string) => {j|"$f": string|j};

/* renderTypeFields */
let objTypeFields = (fields: array(string)) =>
  Array.fold_left(
    (acc, f) =>
      switch acc {
      | "" => objTypeField(f)
      | str =>
        let next = objTypeField(f);
        {j|$str,\n$(next)|j};
      },
    "",
    fields
  );

/* renderObjTypeStr */
let objType = fields =>
  switch (objTypeFields(fields)) {
  | "" => {js|{.}|js}
  | str => {j|{.\n$str\n}|j}
  };

type file = (string, string);

let styleFile = (files: array(file)) : string =>
  files
  |> Array.to_list
  |> List.sort((a, b) => {
       let (fa, _) = a;
       let (fb, _) = b;
       compare(fa, fb);
     })
  |> List.fold_left(
       (acc, (_, content)) =>
         switch acc {
         | "" => content
         | str => {j|$str\n$content|j}
         },
       ""
     )
  |> (
    fun
    | "" => header
    | content => {j|$header\n$content|j}
  );

/* calcRequireFilepath */
let calcRequireFilepath = (~rePath: string, ~cssPath: string, ()) => {
  let re = Node.Path.parse(rePath);
  let css = Node.Path.parse(cssPath);
  let rel = Node.Path.relative(~from=re##dir, ~to_=css##dir, ());
  let cssBase = css##base;
  switch rel {
  | "" => {j|./$cssBase|j}
  | rel when rel.[0] !== '.' => {j|./$rel/$cssBase|j}
  | _ => {j|$rel/$cssBase|j}
  };
};

let ocamlify = str =>
  str
  |> String.uncapitalize
  |> Js_string.replaceByRe([%bs.re "/[\\-\\.]/g"], "_");

let calcIdentifierName =
    (~cssFileName: string, ~extFormat: option(string)=?, ()) => {
  let withoutExt =
    switch extFormat {
    | None => Node.Path.parse(cssFileName)##name
    | Some(extFormat) => Js.String.split(extFormat, cssFileName)[0]
    };
  ocamlify(withoutExt);
};

let reCssBindings =
    (
      ~classes: array(string),
      ~rePath: string,
      ~cssPath: string,
      ~extFormat: string,
      ()
    )
    : string => {
  let cssFileName = Node.Path.parse(cssPath)##base;
  let identifier = calcIdentifierName(~cssFileName, ~extFormat, ());
  let filepath = calcRequireFilepath(~rePath, ~cssPath, ());
  let type_ = objType(classes);
  externalDef(~identifier, ~filepath, ~type_, ());
};
