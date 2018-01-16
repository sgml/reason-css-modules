const {
  renderTypeFields,
  renderObjTypeStr,
  renderStyleFileStr,
  renderExternalDef
} = require("../generate");

describe("restuff", () => {
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
});
