const {
  renderTypeFields,
  renderObjTypeStr,
  renderStyleFileStr,
  renderExternalDef,
  calcRequireFilepath,
  calcIdentifierName,
  ocamlify
} = require("../generate");

describe("renderTypeFields", () => {
  it("should return empty string on empty input", () => {
    expect(renderTypeFields([])).toMatchSnapshot();
  });

  it("should render multiple fields", () => {
    const ret = renderTypeFields(["a", "b"]);
    expect(ret).toMatchSnapshot();
  });

  it("should not render comma in last line", () => {
    const ret = renderTypeFields(["a"]);
    expect(ret).toMatchSnapshot();
  });
});

describe("renderStyleFileStr", () => {
  it("should render empty closed object type on empty input", () => {
    expect(renderObjTypeStr([])).toMatchSnapshot();
  });

  it("should render object with one field", () => {
    expect(renderObjTypeStr(["a"])).toMatchSnapshot();
  });

  it("should render object with multiple fields", () => {
    expect(renderObjTypeStr(["a", "b"])).toMatchSnapshot();
  });
});

describe("renderExternalDef", () => {
  it("should render external definition with placeholder if arg not provided", () => {
    expect(renderExternalDef({})).toMatchSnapshot();
  });

  it("should render external definition with all placeholders set correctly", () => {
    expect(
      renderExternalDef({
        identifier: "button",
        filepath: "./components/button.module.scss",
        type: '{."root": string}'
      })
    ).toMatchSnapshot();
  });
});

describe("renderStyleFileStr", () => {
  it("should render empty files on empty input", () => {
    expect(renderStyleFileStr({})).toMatchSnapshot();
  });

  it("should render file with multiple file entries", () => {
    const ret = renderStyleFileStr({
      z: "ztest",
      d: "dtest",
      h: "htest",
      a: "atest"
    });
    expect(ret).toMatchSnapshot();
  });
});

describe("calcRequireFilePath", () => {
  it("should find relative path inside same parent directory", () => {
    const reOutputPath = "./src/Styles.re";
    const cssPath = "./src/components/button.module.scss";

    const ret = calcRequireFilepath(reOutputPath, cssPath);

    expect(ret).toEqual("./components/button.module.scss");
  });

  it("should find relative path beyond different sibling directories", () => {
    const reOutputPath = "./bs/Styles.re";
    const cssPath = "./src/components/button.module.scss";
    const ret = calcRequireFilepath(reOutputPath, cssPath);

    expect(ret).toEqual("../src/components/button.module.scss");
  });
});

describe("calcIdentifierName", () => {
  it('should strip basic extension, if no extFormat is provided', () => {
    const ret = calcIdentifierName("simple.scss");
    expect(ret).toEqual("simple");
  });

  it("should correctly remove arbitrary .*.* extensions", () => {
    const ret = calcIdentifierName("button.module.scss", ".module.scss");
    expect(ret).toEqual("button");
  });

  it("should convert special characters to an OCaml compatible way", () => {
    expect(calcIdentifierName("blue-button.scss")).toEqual("blue_button");
    expect(calcIdentifierName("Blue-Button.scss")).toEqual("blue_Button");
    expect(calcIdentifierName("Blue_button.scss")).toEqual("blue_button");
    expect(calcIdentifierName("Blue.button.scss")).toEqual("blue_button");
  });

  it("should convert filenames which do not match the exact extFormat", () => {
    const ret = calcIdentifierName("blue-button.module.scss", ".foo");
    expect(ret).toEqual("blue_button_module_scss");
  });
});

describe("ocamlify", () => {
  it("should ocamlify names correctly", () => {
    expect(ocamlify("Button")).toEqual("button");
    expect(ocamlify("blue-button")).toEqual("blue_button");
  });
});
