open Jest;

let tap = (fn, v) => {
  fn(v);
  v;
};

let _ = {
  open Expect;
  describe("objTypeFields", () => {
    test("should return empty string on empty input", () =>
      expect(Gen.objTypeFields([||])) |> toEqual("")
    );
    test("should render multiple fields", () =>
      expect(Gen.objTypeFields([|"a", "b"|])) |> toMatchSnapshot
    );
    test("should not render comma in last line", () =>
      expect(Gen.objTypeFields([|"a"|])) |> toMatchSnapshot
    );
  });
  describe("objType", () => {
    test("should render empty closed object type on empty input", () =>
      Gen.objType([||]) |> expect |> toEqual("{.}")
    );
    test("should render object with one field", () =>
      Gen.objType([|"a"|]) |> expect |> toMatchSnapshot
    );
    test("should render object with multiple fields", () =>
      Gen.objType([|"a", "b"|]) |> expect |> toMatchSnapshot
    );
  });
  describe("externalDef", () => {
    test(
      "should render external definition with placeholder if arg not provided",
      () =>
      Gen.externalDef() |> expect |> toMatchSnapshot
    );
    test(
      "should render external definition with all placeholders set correctly",
      () =>
      Gen.externalDef(
        ~identifier="button",
        ~filepath="./components/button.module.scss",
        ~type_={js|{."root": string}|js},
        ()
      )
      |> expect
      |> toMatchSnapshot
    );
  });
  describe("renderStyleFileStr", () => {
    test("should render files on empty input", () =>
      Gen.styleFile([||]) |> expect |> toMatchSnapshot
    );
    test("should render file with multiple file entries", () =>
      Gen.styleFile([|
        ("z", "ztest"),
        ("d", "dtest"),
        ("h", "htest"),
        ("a", "atest")
      |])
      |> expect
      |> toMatchSnapshot
    );
  });
  describe("calcRequireFilePath", () => {
    test("should find relative path inside same parent directory", () =>
      Gen.calcRequireFilepath(
        ~rePath="./src/Styles.re",
        ~cssPath="./src/components/button.module.scss",
        ()
      )
      |> expect
      |> toEqual("./components/button.module.scss")
    );
    test("should find relative path beyond different sibling directories", () =>
      Gen.calcRequireFilepath(
        ~rePath="./bs/Styles.re",
        ~cssPath="./src/components/button.module.scss",
        ()
      )
      |> expect
      |> toEqual("../src/components/button.module.scss")
    );
    test("should find relative path in same directory", () =>
      Gen.calcRequireFilepath(
        ~rePath="./src/Styles.re",
        ~cssPath="./src/style.module.scss",
        ()
      )
      |> expect
      |> toEqual("./style.module.scss")
    );
  });
  describe("calcIdentifierName", () => {
    test("should strip basic extension, if no extFormat is provided", () =>
      Gen.calcIdentifierName(~cssFileName="simple.scss", ())
      |> expect
      |> toEqual("simple")
    );
    test("should correctly remove arbitrary .*.* extensions", () =>
      Gen.calcIdentifierName(
        ~cssFileName="button.module.scss",
        ~extFormat=".module.scss",
        ()
      )
      |> expect
      |> toEqual("button")
    );
    testAll(
      "should convert special characters to an OCaml compatible way",
      [
        ("blue-button.scss", None, "blue_button"),
        ("Blue-Button.scss", None, "blue_Button"),
        ("Blue_button.scss", None, "blue_button"),
        ("Blue.button.scss", None, "blue_button")
      ],
      ((cssFileName, extFormat, expVal)) =>
      Gen.calcIdentifierName(~cssFileName, ~extFormat?, ())
      |> expect
      |> toEqual(expVal)
    );
    test("should convert filenames which do not match the exact extFormat", () =>
      Gen.calcIdentifierName(
        ~cssFileName="blue-button.module.scss",
        ~extFormat=".foo",
        ()
      )
      |> expect
      |> toEqual("blue_button_module_scss")
    );
  });
  describe("ocamlify", () =>
    testAll(
      "should ocamlify names correctly",
      [("Button", "button"), ("blue-button", "blue_button")],
      ((input, expValue)) =>
      Gen.ocamlify(input) |> expect |> toEqual(expValue)
    )
  );
};
